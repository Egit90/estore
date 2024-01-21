import { useMemo } from "react";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../features/account/accountSlice";
import { useGetCurrentUserQuery } from "../services/auth";

export const useAuth = () => {
  const user = useSelector(selectCurrentUser);

  // @ts-expect-error user
  useGetCurrentUserQuery(user, { skip: !user });

  return useMemo(() => ({ user }), [user]);
};
