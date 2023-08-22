import style from "styled-components";
export const CubeSpinner=style.div`
animation-name: spincube;
animation-timing-function: ease-in-out;
animation-iteration-count: infinite;
animation-duration: 12s;
transform-style: preserve-3d;
transform-origin: 100px 100px 0;
margin-left: calc(50%);
padding-top:calc(40%);
@keyframes spincube {
    from,
    to {
      transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg);
    }
    16% {
      transform: rotateY(-90deg) rotateZ(90deg);
    }
    33% {
      transform: rotateY(-90deg) rotateX(90deg);
    }
    50% {
      transform: rotateY(-180deg) rotateZ(90deg);
    }
    66% {
      transform: rotateY(-270deg) rotateX(90deg);
    }
    83% {
      transform: rotateX(90deg);
    }
  }  
`;

export const Face1=style.div`
transform: translateZ(100px);
color: #dd0031;
  position: absolute;
  width: 200px;
  height: 200px;
  border: 1px solid #ccc;
  background: rgba(255, 255, 255, 0.4);
  text-align: center;
  font-size: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 0 20px 0px lightyellow;
`;
export const Face2=style.div`
transform: rotateY(90deg) translateZ(100px);
color: #f06529;
  position: absolute;
  width: 200px;
  height: 200px;
  border: 1px solid #ccc;
  background: rgba(255, 255, 255, 0.4);
  text-align: center;
  font-size: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 0 20px 0px lightyellow;
`;
export const Face3=style.div`
transform: rotateY(90deg) rotateX(90deg) translateZ(100px);
color: #28a4d9;
  position: absolute;
  width: 200px;
  height: 200px;
  border: 1px solid #ccc;
  background: rgba(255, 255, 255, 0.4);
  text-align: center;
  font-size: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 0 20px 0px lightyellow;
`;
export const Face4=style.div`
transform: rotateY(180deg) rotateZ(90deg) translateZ(100px);
color: #5ed4f4;
  position: absolute;
  width: 200px;
  height: 200px;
  border: 1px solid #ccc;
  background: rgba(255, 255, 255, 0.4);
  text-align: center;
  font-size: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 0 20px 0px lightyellow;
`;

export const Face5=style.div`
transform: rotateY(-90deg) rotateZ(90deg) translateZ(100px);
color: #efd81d;
  position: absolute;
  width: 200px;
  height: 200px;
  border: 1px solid #ccc;
  background: rgba(255, 255, 255, 0.4);
  text-align: center;
  font-size: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 0 20px 0px lightyellow;
`;

export const Face6=style.div`
transform: rotateX(-90deg) translateZ(100px);
color: #ec4d28;
  position: absolute;
  width: 200px;
  height: 200px;
  border: 1px solid #ccc;
  background: rgba(255, 255, 255, 0.4);
  text-align: center;
  font-size: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 0 20px 0px lightyellow;
`;