import { HostStateValue, useHostState } from "#/stores/hostState";
import { useState } from "react";
import QRCode from "react-qr-code";

type player = {
  icon: string;
  name: string;
};

export function HostJoinGame() {
  const updateHostState = useHostState().setHostState;
  const [players, setPlayers] = useState<player[]>([
    {
      icon: "😂",
      name: "DEINE MUTTER",
    },
    {
      icon: "😂",
      name: "DEINE MUTTER stinkt uebel hart und das",
    },
  ]);

  const startGame = () => {
    updateHostState(HostStateValue.Question);
  };

  return (
    <div className="p-8 flex h-screen">
      <div className="m-auto flex gap-5">
        <ul className="list bg-base-300 rounded-box shadow-md w-75">
          {players.map((x) => (
            <li className="list-row p-2">
              <div>{x.icon}</div>
              <p className="truncate w-full">{x.name}</p>
            </li>
          ))}
        </ul>
        <div>
          <h1 className="text-4xl font-bold text-primary-content bg-primary p-1">
            Auf Spieler Warten
          </h1>
          <div className="bg-white p-2 mt-5">
            <QRCode
              value="你他媽剛剛說了什麼，你這小婊子？我告訴你，老子可是海豹突擊隊（Navy SEALs）的首席畢業生，參與過無數次針對「基地」組織的秘密突襲，確認擊殺人數超過300人。我精通遊擊戰術，是整個美軍中最頂尖的狙擊手。在我眼裡，你不過是又一個待宰的目標罷了。我會用一種地球上前所未有的精確手段將你徹底抹殺，給我記好了。你以為網路上對我噴這種垃圾話就能全身而退？再好好想想吧，混蛋。就在我們說話的當口，我正在聯繫遍布全美的秘密情報網追蹤你的IP位址，所以你最好準備迎接風暴吧，你這隻臭蟲。那場將徹底終結你那可憐小命的風暴。你死定了，小子。我可以隨時隨地出現在任何地方，我有七百多種方法來幹掉你，而且光靠徒手就能做到。我不光受過極高強度的徒手格鬥訓練，還能動用美國海軍陸戰隊的整個武器庫；我會毫不留情地動用這一切，把你這該死的雜種從這片大陸上徹底抹去。要是你能預料到你那句「自作聰明」的廢話會招致何等可怕的報應，也許你當時就會管住你那張臭嘴了。但你沒能管住，也沒這麼做，現在你得付出代價了，你這該死的蠢貨。我會把滿腔怒火傾瀉在你身上，讓你徹底淹沒其中。你死定了，小鬼。"
              style={{ height: "auto", maxWidth: "100%", width: "100%" }}
            />
          </div>
          <div className="flex justify-end mt-5">
            <button
              className="btn bg-primary text-primary-content"
              onClick={startGame}
            >
              Start
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
