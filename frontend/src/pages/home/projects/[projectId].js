import {
  ScrollShadow,
  Divider,
  Card, CardHeader, CardFooter,
  Avatar, Skeleton,

} from "@nextui-org/react";
import Link from "next/link";
import moment from "moment-timezone";
import Navigation from "../../../components/Reusable/Navigation/navBarSideBar";

export default function ProjectDetailPage({ project, jobs }) {
  return (
    (
      <>
        <Navigation
          showCreateProjectButton={false}
          breadcrumbs={[
            { text: "Projects", href: "/home/projects" },
            { text: project.title, href: `/home/projects/${project.id}` }]}
        />
        <div className="flex">
          <div className="w-2/6 bg-300 p-4">
            <h1 style={{ fontSize: "25px", marginBottom: "10px" }}>Annotation Jobs</h1>
            <ScrollShadow className="w-[300px] h-[400px]">

              {jobs.map((job) => (
                <Link href="#test" key={job.id}>
                  <div className="mr-2 ml-2">
                    <Card className="mb-4 mt-4 mr-3 w-full" isPressable>
                      <CardHeader className="flex gap-3">
                        <div className="flex flex-col">
                          <p className="text-md">{job.title}</p>
                        </div>
                      </CardHeader>
                      <Divider />
                      <CardFooter className="flex justify-between">
                        <span className="text-xs text-gray-500">
                          {moment(job.created_at).tz("America/New_York").format("llll")}
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
              ))}

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
    )
  );
}

export async function getServerSideProps(context) {
  const { projectId } = context.query;
  const res = await fetch(`http://localhost:8000/projects/${projectId}`);
  const rawData = await res.json();
  const { project } = rawData;
  const { jobs } = rawData;

  return { props: { project, jobs } };
}
