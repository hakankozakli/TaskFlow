import { type GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "./config";

export async function getAuthSession(ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) {
  return await getServerSession(ctx.req, ctx.res, authOptions);
}