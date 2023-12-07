/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-nested-ternary */
/* eslint-disable max-len */
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button, User,
  Pagination,
  Switch,
} from "@nextui-org/react";
import {
  useState, useMemo, useCallback, useEffect,
} from "react";
import SearchIcon from "../../../Icons/SearchIcon";
import LoadingSymbol from "../../../Reusable/loadingSymbol";
import AxiosWrapper from "../../../../utils/axiosWrapper";

const columns = [
  { name: "NAME", uid: "name" },
  { name: "EMAIL", uid: "email" },
  { name: "Annotator", uid: "isAnnotator" },
  { name: "Reviewer", uid: "isReviewer" },
];

export default function AnnotatorEditComponent({
  created_by_id, onClose, projectId, jobId,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [filterValue, setFilterValue] = useState("");
  const [selectedKeys, setSelectedKeys] = useState(new Set([]));
  const rowsPerPage = 6;
  const [page, setPage] = useState(1);
  const [users, setUsers] = useState([]);
  const [refresh, setRefresh] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      let allUsers = (await AxiosWrapper.get(`http://127.0.0.1:8000/projects/${projectId}/jobs/${jobId}/users`)).data;
      allUsers = allUsers.map((user) => ({
        id: user.id,
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        isAnnotator: user.isAnnotator,
        isReviewer: user.isReviewer,
      }));
      setUsers(allUsers);
      setIsLoading(false);
    };
    fetchUsers();
  }, [refresh]);

  const pages = Math.ceil(users.length / rowsPerPage);

  const hasSearchFilter = Boolean(filterValue);

  const filteredItems = useMemo(() => {
    let filteredUsers = [...users];

    if (hasSearchFilter) {
      filteredUsers = filteredUsers.filter((user) => user.name.toLowerCase().includes(filterValue.toLowerCase()));
    }

    return filteredUsers;
  }, [users, filterValue]);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const renderCell = useCallback((user, columnKey) => {
    const cellValue = user[columnKey];

    switch (columnKey) {
      case "name":
        return (
          <User
            avatarProps={{ radius: "full", size: "sm", src: user.avatar }}
            classNames={{
              description: "text-default-500",
            }}
            description={user.email}
            name={cellValue}
          >
            {user.email}
          </User>
        );
      case "isAnnotator":
        return (
          <Switch
            isDisabled={created_by_id === user.id}
            onChange={(e) => { e.preventDefault(); }}
            isSelected={user.isAnnotator}
            onValueChange={async (value) => {
              (await AxiosWrapper.patch(`http://127.0.0.1:8000/users/${user.id}`, {
                projectId,
                jobId,
                isAnnotator: value,
              }));
              const random = Math.random();

              setRefresh(`${user.id}-${random}`);
            }}
          />
        );
      case "isReviewer":
        return (
          <Switch
            onChange={(e) => { e.preventDefault(); }}
            isSelected={user.isReviewer}
            onValueChange={async (value) => {
              (await AxiosWrapper.patch(`http://127.0.0.1:8000/users/${user.id}`, {
                projectId,
                jobId,
                isReviewer: value,
              }));
              const random = Math.random();

              setRefresh(`${user.id}-${random}`);
            }}
          />
        );

      default:
        return cellValue;
    }
  }, []);

  const onSearchChange = useCallback((value) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const topContent = useMemo(() => (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between gap-3 items-end">
        <Input
          isClearable
          classNames={{
            base: "w-full sm:max-w-[44%]",
            inputWrapper: "border-1",
          }}
          placeholder="Search by name..."
          size="sm"
          startContent={<SearchIcon className="text-default-300" />}
          value={filterValue}
          variant="bordered"
          onClear={() => setFilterValue("")}
          onValueChange={onSearchChange}
        />
      </div>
    </div>
  ), [
    filterValue,
    columns,
    onSearchChange,
    users.length,
    hasSearchFilter,
  ]);

  const bottomContent = useMemo(() => (
    <div className="py-2 px-2 flex justify-between items-center">
      <Pagination
        showControls
        classNames={{
          cursor: "bg-foreground text-background",
        }}
        color="default"
        isDisabled={hasSearchFilter}
        page={page}
        total={pages}
        variant="light"
        onChange={setPage}
      />
      <span className="text-small text-default-400">
        {selectedKeys === "all"
          ? "All items selected"
          : `${selectedKeys.size} of ${items.length} selected`}
      </span>
    </div>
  ), [selectedKeys, items.length, page, pages, hasSearchFilter]);

  const classNames = useMemo(
    () => ({
      wrapper: ["max-h-[382px]", "max-w-3xl"],
      th: ["bg-transparent", "text-default-500", "border-b", "border-divider"],
      td: [
        // changing the rows border radius
        // first
        "group-data-[first=true]:first:before:rounded-none",
        "group-data-[first=true]:last:before:rounded-none",
        // middle
        "group-data-[middle=true]:before:rounded-none",
        // last
        "group-data-[last=true]:first:before:rounded-none",
        "group-data-[last=true]:last:before:rounded-none",
      ],
    }),
    [],
  );

  return (
    isLoading ? <LoadingSymbol height={200} width={200} /> : (
      <>
        <Table
          isCompact
          removeWrapper
          aria-label="Example table with custom cells, pagination and sorting"
          bottomContent={bottomContent}
          bottomContentPlacement="outside"
          checkboxesProps={{
            classNames: {
              wrapper: "after:bg-foreground after:text-background text-background",
            },
          }}
          classNames={classNames}
          selectedKeys={selectedKeys}
          selectionMode="multiple"
          topContent={topContent}
          topContentPlacement="outside"
        >
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn
                key={column.uid}
                allowsSorting={column.sortable}
              >
                {column.name}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody emptyContent="No users found" items={items}>
            {(item) => (
              <TableRow key={item.id}>
                {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
              </TableRow>
            )}
          </TableBody>
        </Table>

        <div className="absolute bottom-0 right-0 mr-5 mb-5">
          <div className="flex space-x-4">
            <Button
              color="danger"
              variant="light"
              onPress={() => {
                onClose();
              }}
            >
              Cancel
            </Button>
          </div>
        </div>

      </>
    )

  );
}
