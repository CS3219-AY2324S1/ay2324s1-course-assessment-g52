// Import redux
import { useDispatch, useSelector } from "react-redux";
import { initMatch } from "../../redux/slices/matchSlice";
import { firebaseAuth } from "../../utils/firebase";
// Import components
import Button from "../../components/Button/Button";
import Loading from "../../components/Loading/Loading";
import { useRemoveUserMutation, useCheckMatchMutation } from "../../redux/api";
import { CountdownCircleTimer } from "react-countdown-circle-timer";

// Import MUI
import { Box } from "@mui/material";

// Import style
import "./Matchmake.scss";
import { useEffect, useState } from "react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Matchmake = () => {
  const dispatch = useDispatch();

  const [removeUser, {}] = useRemoveUserMutation();
  const [checkMatch] = useCheckMatchMutation();

  const isMatchButtonEnabled = useSelector(
    (state: any) => state.isMatching.isMatchButtonEnabled
  );

  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userToken, setUserToken] = useState<string | null>(null);
  const intervalRef = React.useRef<number>();
  const isMatchActive = React.useRef(true); // Track if the match is still active

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = firebaseAuth.onAuthStateChanged((user) => {
      if (user) {
        // User is signed in. Get the user's email and token.
        const email = user?.email;
        setUserToken(user.uid);
        setUserEmail(email);
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

  useEffect(() => {
    // Call checkForMatchPeriodically when userToken changes
    if (userToken) {
      checkForMatchPeriodically();
    }
  }, [userToken]);

  // Check for a match every 5 seconds
  const checkForMatchPeriodically = () => {
    let iterations = 0;
    intervalRef.current = window.setInterval(async () => {
      if (!isMatchActive.current) {
        // Stop checking if the match is no longer active
        clearInterval(intervalRef.current);
        return;
      }
      console.log(userToken);
      await checkMatch({
        id: userToken ? userToken : "",
        email: userEmail ? userEmail : "",
        topic: "",
        difficulty: "Hard",
      }).then((res: any) => {
        if ("data" in res && typeof res.data === "object") {
          const jsonString = JSON.stringify(res);
          if (jsonString.includes("Not Matched")) {
            console.log("No match yet!");
          } else {
            console.log(res.data);
            const otherUserId = res?.data?.matched_user?.matchedId;
            const questionId = res?.data?.matched_user?.questionId;
            if (otherUserId && questionId) {
              clearInterval(intervalRef.current);
              isMatchActive.current = false;
              dispatch(initMatch(false));
              navigate(`/app/matched/${questionId}/${otherUserId}`);
              toast.success("Match Found!");
            } else {
              clearInterval(intervalRef.current);
              isMatchActive.current = false;
              dispatch(initMatch(false));
              navigate(`/app/matched/`);
              toast.success("Match Found!");
            }
          }
        }
      });

      iterations++;

      if (iterations >= 12) {
        // Stop the interval after 1 minute
        handleCancel();
        toast.error("No match found :(");
      }
    }, 5000); //5 seconds
  };

  const handleCancel = () => {
    clearInterval(intervalRef.current);
    isMatchActive.current = false;
    removeUser({
      id: userToken ? userToken : "",
      email: userEmail ? userEmail : "",
      topic: "",
      difficulty: "Easy",
    }).then((res) => {
      console.log("Trying to remove");
      console.log(res);
    });
    dispatch(initMatch(false));
  };

  return (
    <Box
      className="matchmake_background"
      sx={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        className="matchmake_container"
        sx={{
          height: "80%",
        }}
      >
        <h1 style={{ fontWeight: "bold" }}>
          Please wait while <br /> we find you a match
        </h1>
        <CountdownCircleTimer
          isPlaying
          duration={60}
          colors={["#FFD800", "#FFE333", "#FFEC66", "#FFF8D8"]}
          colorsTime={[7, 5, 2, 0]}
          size={180}
        >
          {({ remainingTime }) => (
            <div>
              <h2 style={{ fontWeight: "bold" }}>{remainingTime} </h2>
              <h3>Seconds</h3>
            </div>
          )}
        </CountdownCircleTimer>
        <Loading />
        <Button
          title={"Cancel"}
          buttonStatus={isMatchButtonEnabled}
          event={() => {
            handleCancel();
          }}
          style={{ fontSize: 18, width: 110 }}
        />
      </Box>
    </Box>
  );
};

export default Matchmake;
