import {
  Card, CardHeader, CardFooter,
  CardBody, Avatar, Button,
} from "@nextui-org/react";

import Link from "next/link";

export default function ProjectCard({ projectData }) {
  return (
    <Link href={`projects/${projectData.project_id}`}>
      <Card className="max-w-[340px]">
        <CardHeader className="justify-between">
          <div className="flex gap-5">
            <Avatar isBordered radius="full" size="md" name={projectData.user_email_of_owner} />
            <div className="flex flex-col gap-1 items-start justify-center">
              <h4 className="text-small font-semibold leading-none text-default-600">{projectData.project_title}</h4>
              <h5 className="text-[11px] tracking-tight text-default-400">{projectData.user_email_of_owner}</h5>
            </div>
          </div>
          <Button
            color={projectData.is_owner ? "primary" : "warning"}
            radius="full"
            size="sm"
            disabled
            variant={projectData.is_owner ? "solid" : "bordered"}
          >
            {projectData.is_owner ? "Owner" : "Member"}
          </Button>

        </CardHeader>
        <CardBody className="px-3 py-0 text-small text-default-400 h-14 overflow-y-auto">
          <p>
            {projectData.project_description}
          </p>

        </CardBody>
        <CardFooter className="gap-3">
          <div className="flex gap-1">
            <p className="font-semibold text-default-400 text-small">{projectData.project_member_count}</p>
            <p className=" text-default-400 text-small">{projectData.project_member_count == 1 ? "Member" : "Members"}</p>
          </div>
        </CardFooter>
      </Card>

    </Link>
  );
}
