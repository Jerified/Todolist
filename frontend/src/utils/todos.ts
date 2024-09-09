export interface TodoProps {
    ID: number;
    Text: string;
    Checked: boolean;
    Time?: string;
  }
  
 export interface TodosProps {
    todos: TodoProps[];
    handleCheck: (id: number) => void;
    removeElement: (id: number) => void;
    handleSaveEdit: (id: number, newText: string) => void;

  }

// export const todo: TodoProps[] = [
//     {
//       id: 1,
//       text: "You are hired",
//       checked: false,
//       time: "5 mins",
//     },
//     {
//       id: 2,
//       text: "Do Remote work at Business yield consult",
//       checked: false,
//       time: "10 mins",
//     },
//     {
//       id: 3,
//       text: "Have existential crisis",
//       checked: true,
//       time: "12 hrs",
//     },
//     {
//       id: 4,
//       text: "Get dog food",
//       checked: false,
//       time: "1 hrs",
//     },
//   ]