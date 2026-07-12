import { HostStateValue } from "#/stores/hostState";
import type { Question } from "#/stores/questionState";
import type { Socket } from "socket.io-client";

export const registerHostStateChange = (
  socket: Socket,
  updateQuestionState: (state: Question) => void,
  updateHostState: (state: HostStateValue) => void,
) =>
  socket.on(
    "host:state",
    ({ state, question }: { state: HostStateValue; question?: Question }) => {
      console.log("host state changes");
      console.log(state, question);
      updateHostState(state);

      if (state === HostStateValue.Question && question) {
        updateQuestionState(question);
      }
    },
  );
