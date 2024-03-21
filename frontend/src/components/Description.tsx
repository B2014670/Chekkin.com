import ShowMoreText from 'react-show-more-text';
interface ShowMoreTextComponentProps {
  longText: string;
}
const description = ({ longText }: ShowMoreTextComponentProps) => {

  return (
    <ShowMoreText
      lines={2}
      more={
        <span
          className="text-blue-600 hover:underline cursor-pointer"
        >
          Show more
        </span>
      }
      less={
        <span
          className="text-blue-600 hover:underline cursor-pointer"
        >
          Show less
        </span>
      }
      anchorClass="show-more-less-clickable"
      expanded={false}
      //width={400}
      truncatedEndingComponent={"... "}
    >
      {longText}
    </ShowMoreText>
  );
}

export default description;
