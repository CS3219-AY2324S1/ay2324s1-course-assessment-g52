// Import react
import { useEffect, useState } from "react";
import { useFindMatchMutation } from "../../redux/api";
// Import MUI
import {
  Box,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Stack,
  TextField,
} from "@mui/material";

// Import redux
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../redux/store";
import { initMatch } from "../../redux/slices/matchSlice";

import { firebaseAuth } from "../../utils/firebase";
import { map } from "lodash";
type UserLogoProps = {
  logoLink?: string;
};

type MatchButtonProps = {
  type: "topic" | "difficulty";
  title: string;
  value: string;
};
type CategorySelectProps = {
  categories: string[];
};
const allCategories: string[] = [
  "Arrays",
  "Bit Manipulation",
  "Strings",
  "Brainteaser",
  "Data Structures",
  "Algorithms",
  "Recursion",
  "Databases",
];
//----------------------------------------------------------------//
//                      LOCAL COMPONENTS                          //
//----------------------------------------------------------------//
const UserLogo = (props: UserLogoProps) => {
  const { logoLink } = props;
  return (
    <Stack
      sx={{
        width: 81,
        height: 81,
        backgroundImage: logoLink ?? "/user/ellipse-bg.svg",
        backgroundColor: "#D9D9D9",
        borderRadius: "50%",
        display: "flex",
        flexdirection: "column",
        justifyContent: "center",
      }}
    >
      <Stack
        sx={{
          width: 81,
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        <img
          height="64"
          width="59"
          src="/user/default-male-user-logo.svg"
          alt="user"
        />
      </Stack>
    </Stack>
  );
};

type UserCardProps = {
  admin: boolean;
};
const UserCard = (props: UserCardProps) => {
  const { admin } = props;
  //----------------------------------------------------------------//
  //                          HOOKS                                 //
  //----------------------------------------------------------------//
  const dispatch = useDispatch();
  const { data: user } = useSelector((state: RootState) => state.user);
  const [selectedCategory, setSelectedCategory] = useState<string>("undefined");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("");
  const [findMatch, {}] = useFindMatchMutation();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userToken, setUserToken] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = firebaseAuth.onAuthStateChanged((user) => {
      if (user) {
        // User is signed in. Get the user's email and token.
        const email = user?.email;
        setUserEmail(email);
        setUserToken(user.uid);
      } else {
        // User is signed out.
        setUserEmail(null);
        setUserToken(null);
      }
    });

    // Clean up the listener when the component unmounts.
    return () => {
      unsubscribe();
    };
  }, []);
  //----------------------------------------------------------------//
  //                     LOCAL COMPONENTS                           //
  //----------------------------------------------------------------//
  const CategorySelect = (props: CategorySelectProps) => {
    const { categories } = props;
    return (
      <>
        <InputLabel
          id="category-select"
          sx={{
            color: "black",
            fontFamily: "Poppins",
            fontWeight: 600,
          }}
        >
          <h4>Category</h4>
        </InputLabel>
        <TextField
          value={selectedCategory}
          select
          InputProps={{
            sx: {
              color: "black",
              fontFamily: "Poppins",
              fontWeight: 600,
              borderRadius: 14,
              backgroundColor:
                selectedCategory && selectedCategory != "undefined"
                  ? "#FFD900"
                  : "white",
              border: "3px solid black",
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                border: "1px solid #484850",
              },
            },
          }}
          sx={{
            fontFamily: "Poppins",
            fontWeight: 600,
            borderRadius: 51,
          }}
        >
          <MenuItem
            value="undefined"
            sx={{
              fontFamily: "Poppins",
              fontWeight: 600,
            }}
            onClick={() => {
              setSelectedCategory("undefined");
            }}
            disabled
          >
            Choose a Category
          </MenuItem>
          {map(categories, (category) => {
            return (
              <MenuItem
                value={category}
                sx={{
                  fontFamily: "Poppins",
                  fontWeight: 600,
                }}
                onClick={() => {
                  setSelectedCategory(
                    selectedCategory == category ? "undefined" : category
                  );
                }}
              >
                {category}
              </MenuItem>
            );
          })}
        </TextField>
      </>
    );
  };
  const MatchButton = (props: MatchButtonProps) => {
    const { type, title, value } = props;
    const getBackgroundColor = () => {
      if (value === selectedCategory || value === selectedDifficulty) {
        return "#FFD900";
      } else {
        return "white";
      }
    };
    return (
      <IconButton
        sx={{
          color: "black",
          backgroundColor: getBackgroundColor(),
          height: 33,
          width: type === "topic" ? 85 : 100,
          borderRadius: 14,
          border: "3px solid black",
          "&:hover": {
            color: "black",
            border: "3px solid black",
          },
          fontFamily: "Poppins",
          fontWeight: 600,
          fontSize: 13,
        }}
        disableRipple
        onClick={() => {
          if (value === selectedCategory || value === selectedDifficulty) {
            type === "topic"
              ? setSelectedCategory("")
              : setSelectedDifficulty("");
          } else {
            type === "topic"
              ? setSelectedCategory(value)
              : setSelectedDifficulty(value);
          }
        }}
      >
        {title}
      </IconButton>
    );
  };
  //----------------------------------------------------------------//
  //                          RENDER                                //
  //----------------------------------------------------------------//
  return (
    <Paper
      sx={{
        width: "100%",
        height: "fit-content",
        padding: 5,
        borderRadius: 5,
      }}
    >
      <Stack spacing={5} sx={{}}>
        <Stack direction={"row"} justifyContent={"center"} spacing={3}>
          <UserLogo />
          <Stack direction={"column"}>
            <Box
              sx={{
                fontWeight: 600,
                fontSize: 17,
                textAlign: "left",
              }}
            >
              {user?.username}
            </Box>
            <Box
              sx={{
                textAlign: "left",
              }}
            ></Box>
            {admin ? (
              <Box
                sx={{
                  marginTop: "50%",
                  textAlign: "left",
                  fontWeight: 600,
                }}
              >
                Admin
              </Box>
            ) : (
              <Box
                sx={{
                  textAlign: "left",
                  fontWeight: 600,
                }}
              >
                User
              </Box>
            )}
          </Stack>
        </Stack>
        <Stack
          direction={"column"}
          spacing={3}
          sx={{
            borderTop: "1px solid #D9D9D9",
            pt: 3,
          }}
        >
          <CategorySelect categories={allCategories} />
          <h4>Difficulty</h4>
          <Stack direction={"row"} justifyContent={"center"} spacing={2}>
            <MatchButton type="difficulty" title="Easy" value="Easy" />
            <MatchButton type="difficulty" title="Medium" value="Medium" />
            <MatchButton type="difficulty" title="Hard" value="Hard" />
          </Stack>
          <Stack
            direction={"row"}
            justifyContent={"center"}
            sx={{
              mt: 3,
            }}
          >
            <IconButton
              disabled={
                selectedDifficulty == "" &&
                (selectedCategory == "undefined" || selectedCategory == "")
              }
              sx={{
                color: "black",
                backgroundColor: "#FFD900",
                height: 53,
                width: 85,
                borderRadius: 14,
                border: "3px solid black",
                "&:hover": {
                  color: "black",
                  border: "3px solid black",
                },
                fontFamily: "Poppins",
                fontWeight: 600,
                fontSize: 13,
              }}
              disableRipple
              onClick={() => {
                findMatch({
                  email: userEmail ? userEmail : "",
                  id: userToken ? userToken : "",
                  topic:
                    selectedCategory === "undefined"
                      ? ""
                      : selectedCategory
                      ? selectedCategory
                      : "",
                  difficulty: selectedDifficulty ? selectedDifficulty : "",
                }).then((res) => {
                  console.log(res);
                  dispatch(initMatch(true));
                });
              }}
            >
              Match
            </IconButton>
          </Stack>
        </Stack>
      </Stack>
    </Paper>
  );
};

export default UserCard;
