import React from "react";

import {
  Card, CardHeader, CardBody, CardFooter, Divider, Image,
} from "@nextui-org/react";
import Link from "next/link";
import style from "../../styles/components/Reusable/projectCard.module.css";

export default function ProjectCard({ projectData }) {
  return (
    <Link href={`projects/${projectData.id}`}>
      <Card
        className="max-w-[220px] min-w-[220px] min-h-[250px] max-h-[250px]"
        isPressable
      >

        <CardHeader className="flex gap-3">

          <Image
            alt="nextui logo"
            height={40}
            radius="sm"
            src="/images/structured_data.svg"
            width={40}
          />
          <div className="flex flex-col">
            <p className="text-md">{projectData.title}</p>
          </div>
        </CardHeader>
        <Divider />
        <CardBody>
          <p className={style.truncateText}>{projectData.description ? projectData.description : "No description..."}</p>
        </CardBody>
        <Divider />
        <CardFooter className="flex justify-between">
          <span className="text-xs text-gray-500">
            {projectData.author}
          </span>
        </CardFooter>

      </Card>
    </Link>
  );
}
