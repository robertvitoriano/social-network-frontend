import { IComment } from "./Post";
type Props = {
  comment: IComment;
};
export const Comment = ({ comment }: Props) => {
  return (
    <div className="flex gap-4 items-center">
      <div className="flex flex-col h-10 w-10 ">
        <img src={comment.user.avatar} className="rounded-full" />
      </div>
      <div className="p-4 pt-1 bg-secondary rounded-md flex flex-1 flex-col gap-2">
        <div className="flex justify-between items-center">
          <span className="font-bold">{comment.user.name}</span>
          <span className="font-bold text-xs">
            {new Date(comment.createdAt).toLocaleDateString()}
            {/*  new Date(comment.createdAt).toLocaleTimeString()}  */}
          </span>
        </div>
        <p>{comment.content}</p>
      </div>
    </div>
  );
};
