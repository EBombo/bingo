const transpose = (matrix) => {
  return Object.keys(matrix[0]).map(function (c) {
    return matrix.map((r) => {
      return r[c];
    });
  });
};

export const getBingoCard = () => {
  let arr = [
    [], // b (1-15)
    [], // i (16-30)
    [], // n (31-45)
    [], // g (46-60)
    [], // o (51-75)
  ];

  for (let i = 0; i < arr.length; i++) {
    let min = i * 15 + 1;
    let max = min + 15;

    while (arr[i].length < 5) {
      let num = Math.floor(Math.random() * (max - min)) + min;

      if (!arr[i].includes(num)) {
        arr[i].push(num);
      }
    }

    arr[i].sort((a, b) => a - b);
  }

  return transpose(arr);
};

export const createBoard = () =>
  Array.from({ length: MAX_NUMBER_BOARD }, (_, i) => i + 1).reduce(
    (board, number) => ({ ...board, [number]: false }),
    {}
  );

export const generateMatrix = (value = null) =>
  Array.from(Array(5), () => new Array(5).fill(value));

export const getNumberBoard = (board) =>
  Object.keys(board).reduce(
    (sum, key) => (board[key] ? [...sum, +key] : sum),
    []
  );

export const MAX_NUMBER_BOARD = 75;

export const BOARD_PARAMS = {
  B: { value: 16 },
  I: { value: 31 },
  N: { value: 46 },
  G: { value: 61 },
  O: { value: 75 },
};
