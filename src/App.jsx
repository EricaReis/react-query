import axios from "axios";
import { useQuery, useMutation, useQueryClient } from 'react-query';

import "./App.css";

function App() {
  const queryClient = useQueryClient();

  // First useQuery param is query's name and second is an function  
  // isLoading from useQuery inform if query is being performed or is completed
  // This error constant will be populated after all retry requests return error
  const { data, isLoading, error, refetch } = useQuery('todos', () => {
    // Getting api response then getting data from api response
    return axios
      .get("http://localhost:8080/todos")
      .then((response) => response.data);
  },
  //If request provides an error, react-query can resend as many requests as you want
    {
      //retry: 5,
      //refetchOnWindowFocus repeat request after user switch back browser tab 
      //refetchOnWindowFocus: true,
      //refetchInterval gives a possibility to resend request from time to time, time in ms
      //refetchInterval: 5000,
      //initialData starts with filled data so they are not empty
      //initialData: [{id: "1", title: 'teste'}]
    }
  );

  /*useMutation will receive an property mutationFn with an 
  function that will be executed when mutation is called */
  const mutation = useMutation({
    //first param is todo id and second is paramether to be changed
    mutationFn: ({todoId, completed}) =>{
      return axios
        .patch(`http://localhost:8080/todos/${todoId}`, {
          completed,
        })
        .then((response) => response.data);
    },
    onSuccess: (data) => {
      //when mutation success, remade query to update element on screen
      //first option, using refetch:
      refetch();
      //second option, doing manually width useQueryClient, better than redoing query
      queryClient.setQueryData("todos", (currentData) => currentData.map(todo => todo.id === data.id ?  data :  todo));
    },
    onError: (error) => {
      console.error(error);
    }
  });

  //With mutation.isLoading we can deal with mutation errors
    
  // React query isLoading gives an complete state monitoring
  if (isLoading) {
    return <div className="loading">Carregando...</div>;
  };

  if (error) {
    return <div className="loading">Algo deu errado!</div>
  };

  return (
    <div className="app-container">
      <div className="todos">
        <h2>Todos & React Query</h2>
        {data.map((todo) => (
          <div
            onClick={() => mutation.mutate({ todoId: todo.id, completed: !todo.completed })}
            className={`todo ${todo.completed && "todo-completed"}`}
            key={todo.id}
          >
            {todo.title}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;