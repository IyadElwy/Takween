import React from "react";

import {
  Card, CardHeader, CardBody, Divider, Image,
} from "@nextui-org/react";
import Link from "next/link";

export default function App({ projectData }) {
  return (
    <Link href={projectData.href}>
      <Card
        className="max-w-[400px]"
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
          <p>{projectData.description}</p>
        </CardBody>
      </Card>
    </Link>
  );
}
