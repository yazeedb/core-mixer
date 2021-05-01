import { Difficulty } from '../data';

export const getDifficultyIcon = (difficulty: Difficulty) => {
  switch (difficulty) {
    case Difficulty.beginner:
      return <BeginnerIcon />;

    case Difficulty.intermediate:
      return <IntermediateIcon />;

    case Difficulty.advanced:
      return <AdvancedIcon />;
  }
};

const BeginnerIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="15"
    viewBox="0 0 16 15"
  >
    <g id="Group_1" data-name="Group 1" transform="translate(-152 -440.555)">
      <rect
        id="Rectangle_6"
        data-name="Rectangle 6"
        width="4"
        height="8"
        transform="translate(152 447.555)"
        fill="#05606e"
      />
      <rect
        id="Rectangle_7"
        data-name="Rectangle 7"
        width="4"
        height="11"
        transform="translate(158 444.555)"
        fill="#888"
      />
      <rect
        id="Rectangle_8"
        data-name="Rectangle 8"
        width="4"
        height="15"
        transform="translate(164 440.555)"
        fill="#888"
      />
    </g>
  </svg>
);

const IntermediateIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="15"
    viewBox="0 0 16 15"
  >
    <g id="Group_57" data-name="Group 57" transform="translate(-162 -442)">
      <g id="Group_1" data-name="Group 1" transform="translate(10 1.445)">
        <rect
          id="Rectangle_6"
          data-name="Rectangle 6"
          width="4"
          height="8"
          transform="translate(152 447.555)"
          fill="#f7c948"
        />
        <rect
          id="Rectangle_7"
          data-name="Rectangle 7"
          width="4"
          height="11"
          transform="translate(158 444.555)"
          fill="#f7c948"
        />
        <rect
          id="Rectangle_8"
          data-name="Rectangle 8"
          width="4"
          height="15"
          transform="translate(164 440.555)"
          fill="#888"
        />
      </g>
    </g>
  </svg>
);

const AdvancedIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="15"
    viewBox="0 0 16 15"
  >
    <g id="Group_2" data-name="Group 2" transform="translate(-162 -442)">
      <g id="Group_1" data-name="Group 1" transform="translate(10 1.445)">
        <rect
          id="Rectangle_6"
          data-name="Rectangle 6"
          width="4"
          height="8"
          transform="translate(152 447.555)"
          fill="#ad1d07"
        />
        <rect
          id="Rectangle_7"
          data-name="Rectangle 7"
          width="4"
          height="11"
          transform="translate(158 444.555)"
          fill="#ad1d07"
        />
        <rect
          id="Rectangle_8"
          data-name="Rectangle 8"
          width="4"
          height="15"
          transform="translate(164 440.555)"
          fill="#ad1d07"
        />
      </g>
    </g>
  </svg>
);
