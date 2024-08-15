import React from "react";

import {
  Card, CardHeader, CardFooter, Divider,
} from "@nextui-org/react";
import Link from "next/link";
import Logo from "../Reusable/logo";

export default function ProjectCard({ projectData }) {
  return (
    <Link href={`projects/${projectData.id}`}>
      <Card
        isHoverable="true"
        className="max-w-[220px] min-w-[220px] "
        isPressable
      >

        <CardHeader className="flex gap-3">
          <Logo spin height={25} width={25} />
          <div className="flex flex-col">
            <p className="text-md">{projectData.title}</p>
          </div>
        </CardHeader>
        <Divider />
        <CardFooter className="flex justify-between">
          <span className="text-xs text-gray-500">
            {projectData.owner_email}
          </span>
        </CardFooter>

      </Card>
    </Link>
  );
}
