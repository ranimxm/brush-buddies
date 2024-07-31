import { PersonProps } from "../type/person";

export const Person = ({ person }: PersonProps) => {
  return (
    <div className="card shadow-lg p-4 m-4 w-[10em] rounded-lg border flex flex-col items-center">
      <div className="text-center">
        <h3 className="text-lg font-semibold">{person.name}</h3>
      </div>
    </div>
  );
};
