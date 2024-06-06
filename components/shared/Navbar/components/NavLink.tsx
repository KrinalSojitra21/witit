import { ListItemText, Stack } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";
import { useAuthContext } from "@/context/AuthContext";
import { theme } from "@/theme";
import { useEffect, useState } from "react";

type Props = {
  name: string;
  link: string | null;
  startIcon: React.ReactElement;
  isSmallScreen: boolean;
} & Record<string, any>;

type GetListStyleProps = { isSmallScreen: boolean; isActive: boolean };

const getListStyle = ({ isSmallScreen, isActive }: GetListStyleProps) => {
  return {
    p: 1.25,
    gap: 1.25,
    alignItems: "center",
    ...(isSmallScreen && { justifyContent: "center" }),
    borderRadius: 2,
    "&>*:nth-of-type(1)": {
      "&>*": {
        color: isActive ? theme.palette.common.white : theme.palette.grey[200],
      },
    },
    ...(isActive && { background: theme.palette.grey[700] }),
    ":hover": {
      backgroundColor: isActive
        ? theme.palette.grey[700]
        : theme.palette.grey[700],
    },
  };
};
const getListStyleNoPage = ({ isSmallScreen, isActive }: GetListStyleProps) => {
  return {
    p: 1.25,
    gap: 1.25,
    alignItems: "center",
    ...(isSmallScreen && { justifyContent: "center" }),
    borderRadius: 2,
    "&>*:nth-of-type(1)": {
      "&>*": {
        color: isActive ? theme.palette.common.white : theme.palette.grey[200],
      },
    },
    ...(isActive && { background: theme.palette.grey[700] }),
    ":hover": {
      backgroundColor: isActive
        ? theme.palette.grey[700]
        : theme.palette.grey[700],
    },
  };
};

export const NavLink = ({
  name,
  link,
  startIcon,
  isSmallScreen,
  ...restProps
}: Props) => {
  const router = useRouter();
  const { asPath } = useRouter();
  const {
    customDrawerType,
    setCustomDrawerType,
    setCustomDialogType,
    customDialogType,
    setGenerationPost,
  } = useAuthContext();

  // useEffect(() => {
  //   // This runs after the component has mounted
  //   if (router.isReady) {
  //     const userIdFromRouter = router.query.user as string;
  //     setUserId(userIdFromRouter);
  //   }
  // }, [router.isReady, asPath]);
  return (
    <div className="relative px-5 flex items-center ">
      {/* {name ===
        customDrawerType
          ?.toLowerCase()
          .replace(/\b\w/g, (s) => s.toUpperCase()) ||
      name ===
        customDialogType
          ?.toLowerCase()
          .replace(/\b\w/g, (s) => s.toUpperCase()) ? (
      ) : router.pathname.split("/")[1].toUpperCase() === activeTab &&
        (name !==
          customDrawerType
            ?.toLowerCase()
            .replace(/\b\w/g, (s) => s.toUpperCase()) ||
          name !==
            customDialogType
              ?.toLowerCase()
              .replace(/\b\w/g, (s) => s.toUpperCase())) ? (
        <div className="w-[5px] h-[30px] bg-primary-main absolute left-0 rounded-tr-md rounded-br-md" />
      ) : null} */}
      {/* {name.toUpperCase() != customDrawerType && customDrawerType !== null ? ( */}
      {(name.toLowerCase() === customDrawerType?.toLowerCase() ||
        name.toLowerCase() === customDialogType?.toLowerCase()) &&
      link === null ? (
        <div className="w-[5px] h-[30px] bg-primary-main absolute left-0 rounded-tr-md rounded-br-md" />
      ) : null}

      {}
      {(router.query.user as string) ? (
        false
      ) : customDrawerType === null &&
        customDialogType === null &&
        link &&
        router.pathname.includes(link) ? (
        <div className="w-[5px] h-[30px] bg-primary-main absolute left-0 rounded-tr-md rounded-br-md" />
      ) : null}

      <>
        {link ? (
          <Link
            href={link}
            passHref
            {...restProps}
            className="flex-grow"
            onClick={() => {
              // setCustomDialogType(null);
              // setCustomDrawerType(null);
            }}
          >
            <Stack
              direction="row"
              sx={getListStyle({
                isSmallScreen,
                isActive: (router.query.user as string)
                  ? false
                  : router.pathname.includes(link),
              })}
            >
              {startIcon}
              {isSmallScreen ? null : (
                <ListItemText className="m-0 " secondary={name} />
              )}
            </Stack>
          </Link>
        ) : (
          <a
            className="flex-grow cursor-pointer"
            onClick={() => {
              setGenerationPost(null);
              if (name.toUpperCase() === "POST") {
                setCustomDialogType((prev) => {
                  if (prev === null || prev === name.toUpperCase()) {
                    if (prev === null) {
                      return name.toUpperCase();
                    } else {
                      return null;
                    }
                  }
                  return name.toUpperCase();
                });
                setCustomDrawerType(null);
              } else {
                setCustomDialogType(null);
                setCustomDrawerType((prev) => {
                  if (prev === null || prev === name.toUpperCase()) {
                    if (prev === null) {
                      return name.toUpperCase();
                    } else {
                      return null;
                    }
                  }
                  return name.toUpperCase();
                });
              }
            }}
          >
            <Stack
              direction="row"
              sx={getListStyleNoPage({
                isSmallScreen,
                isActive:
                  name ===
                    customDrawerType
                      ?.toLowerCase()
                      .replace(/\b\w/g, (s) => s.toUpperCase()) ||
                  name ===
                    customDialogType
                      ?.toLowerCase()
                      .replace(/\b\w/g, (s) => s.toUpperCase()),
              })}
            >
              {startIcon}
              {isSmallScreen ? null : (
                <ListItemText className="m-0 " secondary={name} />
              )}
            </Stack>
          </a>
        )}
      </>
      {/* ) : null} */}
    </div>
  );
};
