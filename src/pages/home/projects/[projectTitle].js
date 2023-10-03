import {
  ScrollShadow,
  useDisclosure,
  Divider,
  Card, CardHeader, CardFooter,
  Avatar, Skeleton,

} from "@nextui-org/react";
import Link from "next/link";
import Navigation from "../../../components/Reusable/Navigation/navBarSideBar";
import CreateNewProjectModal from "../../../components/ProjectOverview/createNewProjectModal";

export default function ProjectDetailPage() {
  const {
    isOpen: isOpenCreateNewProjectModal,
    onOpen: onOpenCreateNewProjectModal,
    onOpenChange: onOpenChangeCreateNewProjectModal,
  } = useDisclosure();

  return (
    <>
      <Navigation
        breadcrumbs={[
          { text: "Projects", href: "/home/projects" },
          { text: "Project Title", href: "/home/projects/1" }]}
        createProjectTrigger={onOpenCreateNewProjectModal}
      />
      <CreateNewProjectModal
        isOpen={isOpenCreateNewProjectModal}
        onOpenChange={onOpenChangeCreateNewProjectModal}
      />
      <div className="flex">
        <div className="w-2/6 bg-300 p-4">
          <h1 style={{ fontSize: "25px", marginBottom: "10px" }}>Annotation Jobs</h1>
          <ScrollShadow className="w-[300px] h-[400px]">

            <Link href="job/1">
              <div className="mr-2 ml-2">
                <Card className="mb-4 mt-4 mr-3 w-full" isPressable>
                  <CardHeader className="flex gap-3">
                    <div className="flex flex-col">
                      <p className="text-md">Annotation Job 1</p>
                    </div>
                  </CardHeader>
                  <Divider />
                  <CardFooter className="flex justify-between">
                    <span className="text-xs text-gray-500">
                      30 Sep ’23, 16:47
                    </span>
                    <Avatar
                      isBordered
                      className="transition-transform"
                      name="Avatar"
                      size="sm"
                    />
                  </CardFooter>

                </Card>
              </div>
            </Link>

            <Divider />
          </ScrollShadow>
        </div>

        <div className="w-5/6 bg-300 p-4">

          <h1 style={{ fontSize: "25px", marginBottom: "15px" }}>Project Title</h1>

          <div className="max-w-[300px] w-full flex items-center gap-3">
            <div>
              <Skeleton className="flex rounded-full w-12 h-12" />
            </div>
            <div className="w-full flex flex-col gap-2">
              <Skeleton className="h-3 w-3/5 rounded-lg" />
              <Skeleton className="h-3 w-4/5 rounded-lg" />
            </div>
          </div>
          <br />
          <Divider />
          <br />

          <div className="max-w-[300px] w-full flex items-center gap-3">
            <div>
              <Skeleton className="flex rounded-full w-12 h-12" />
            </div>
            <div className="w-full flex flex-col gap-2">
              <Skeleton className="h-3 w-3/5 rounded-lg" />
              <Skeleton className="h-3 w-4/5 rounded-lg" />
            </div>
          </div>
          <br />
          <Divider />
          <br />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Card className="w-[200px] space-y-5 p-4" radius="2xl">
              <Skeleton className="rounded-lg">
                <div className="h-24 rounded-lg bg-default-300" />
              </Skeleton>
              <div className="space-y-3">
                <Skeleton className="w-3/5 rounded-lg">
                  <div className="h-3 w-3/5 rounded-lg bg-default-200" />
                </Skeleton>
                <Skeleton className="w-4/5 rounded-lg">
                  <div className="h-3 w-4/5 rounded-lg bg-default-200" />
                </Skeleton>
                <Skeleton className="w-2/5 rounded-lg">
                  <div className="h-3 w-2/5 rounded-lg bg-default-300" />
                </Skeleton>
              </div>
            </Card>
            <Card className="w-[200px] space-y-5 p-4" radius="2xl">
              <Skeleton className="rounded-lg">
                <div className="h-24 rounded-lg bg-default-300" />
              </Skeleton>
              <div className="space-y-3">
                <Skeleton className="w-3/5 rounded-lg">
                  <div className="h-3 w-3/5 rounded-lg bg-default-200" />
                </Skeleton>
                <Skeleton className="w-4/5 rounded-lg">
                  <div className="h-3 w-4/5 rounded-lg bg-default-200" />
                </Skeleton>
                <Skeleton className="w-2/5 rounded-lg">
                  <div className="h-3 w-2/5 rounded-lg bg-default-300" />
                </Skeleton>
              </div>
            </Card>
            <Card className="w-[200px] space-y-5 p-4" radius="2xl">
              <Skeleton className="rounded-lg">
                <div className="h-24 rounded-lg bg-default-300" />
              </Skeleton>
              <div className="space-y-3">
                <Skeleton className="w-3/5 rounded-lg">
                  <div className="h-3 w-3/5 rounded-lg bg-default-200" />
                </Skeleton>
                <Skeleton className="w-4/5 rounded-lg">
                  <div className="h-3 w-4/5 rounded-lg bg-default-200" />
                </Skeleton>
                <Skeleton className="w-2/5 rounded-lg">
                  <div className="h-3 w-2/5 rounded-lg bg-default-300" />
                </Skeleton>
              </div>
            </Card>
            <Card className="w-[200px] space-y-5 p-4" radius="2xl">
              <Skeleton className="rounded-lg">
                <div className="h-24 rounded-lg bg-default-300" />
              </Skeleton>
              <div className="space-y-3">
                <Skeleton className="w-3/5 rounded-lg">
                  <div className="h-3 w-3/5 rounded-lg bg-default-200" />
                </Skeleton>
                <Skeleton className="w-4/5 rounded-lg">
                  <div className="h-3 w-4/5 rounded-lg bg-default-200" />
                </Skeleton>
                <Skeleton className="w-2/5 rounded-lg">
                  <div className="h-3 w-2/5 rounded-lg bg-default-300" />
                </Skeleton>
              </div>
            </Card>

          </div>

        </div>
      </div>
    </>
  );
}
