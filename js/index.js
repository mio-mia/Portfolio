// By https://vuelog.dev
const MIN_WIDTH = 50;
const MAX_WIDTH = MIN_WIDTH * 1.8;
const STEP = (MAX_WIDTH - MIN_WIDTH) * 0.05;

let aniID = null;
const dock = document.querySelector(".dock");

const updateWidth = function (nextWidths) {
  window.cancelAnimationFrame(aniID);

  aniID = null;

  let isAllDone = true;
  let newWidth = 0;
  const items = document.querySelectorAll(".item");
  for (let i = 0; i < items.length; i++) {
    const currWidth = items[i].getBoundingClientRect().width;
    const goalWidth = nextWidths[i];
    if (goalWidth < currWidth) {
      newWidth = Math.max(currWidth - STEP, goalWidth);
      isAllDone = false;
    } else if (goalWidth > currWidth) {
      newWidth = Math.min(currWidth + STEP, goalWidth);
      isAllDone = false;
    } else {
      newWidth = goalWidth;
    }
    items[i].style.width = newWidth + "px";
  }

  // 다시 애니메이션 추가
  if (!isAllDone) {
    aniID = window.requestAnimationFrame(() => {
      updateWidth(nextWidths);
    });
  }
};

dock.addEventListener("mousemove", function (e) {
  const dockTop = e.target.getBoundingClientRect().top;
  const y = e.clientY - dockTop;

  const nextWidths = [];
  const items = document.querySelectorAll(".item");
  for (const item of items) {
    const rect = item.getBoundingClientRect();
    const center = rect.top - dockTop + rect.height / 2;

    const dist = Math.abs(center - y);
    nextWidths.push(Math.max(MAX_WIDTH - dist / 4, MIN_WIDTH));
  }
  updateWidth(nextWidths);
});

dock.addEventListener("mouseleave", function (e) {
  const items = document.querySelectorAll(".item");
  const nextWidths = [];
  for (const item of items) {
    nextWidths.push(MIN_WIDTH);
  }
  updateWidth(nextWidths);
});
