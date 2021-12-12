import React, {useEffect, useState} from "react";
import ReactDOM from "react-dom";
import "antd/dist/antd.css";
import { Progress } from "antd";

const styles = {
  container: {
    marginTop: "100px",
    display: 'flex',
    flexDirection: 'row',
  },
  vertical: {
    width: '30px',
    transform: "rotate(-90deg)"
  }
};

export const colorMap = {
  'green': '#008000',
  'yellow': '#ffff00',
  'orange': '#ffa500',
  'redOrange': '#ff4500',
  'red': '#ff0000',
};


const colorForPercent = (percent) => {
  console.log(percent);
  if (percent >= 0 && percent < 20) {
    return colorMap['green'];
  }
  if (percent >= 20 && percent < 40) {
    return colorMap['yellow'];
  }
  if (percent >= 40 && percent < 60) {
    return colorMap['orange'];
  }
  if (percent >= 60 && percent < 90) {
    return colorMap['redOrange'];
  }
  if (percent >= 90 && percent < 100) {
    return colorMap['red'];
  }
}

const scale = (number, inMin, inMax, outMin, outMax) => (number - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;

const mapDbToPercent = (db) => {
  return scale(db, -40, 40, 0, 100);
}

export const VuMeter = ({vu}) => {

  const [vu1Value, setVu1Value] = useState(0);
  const [vu1Color, setVu1Color] = useState(colorMap['green']);
  const [vu2Value, setVu2Value] = useState(0);
  const [vu2Color, setVu2Color] = useState(colorMap['green']);

  useEffect(() => {
    const percent1 = mapDbToPercent(vu[0]);
    const percent2 = mapDbToPercent(vu[1]);
    setVu1Value(percent1);
    setVu2Value(percent2);
    setVu1Color(colorForPercent(percent1));
    setVu2Color(colorForPercent(percent2));
  }, [vu])

  return (
      <>
        <div style={styles.container}>
          <div style={styles.vertical}>
            <Progress
                percent={vu1Value}
                steps={32}
                size="small"
                strokeColor={vu1Color}
                strokeWidth="20px"
                showInfo={false}
            />
          </div>
          <div style={styles.vertical}>
            <Progress
                percent={vu2Value}
                steps={32}
                size="small"
                strokeColor={vu2Color}
                strokeWidth="20px"
                showInfo={false}
            />
          </div>
        </div>
      </>
  );
};
