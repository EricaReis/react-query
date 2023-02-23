import axios from "axios";
import { useQuery } from 'react-query';

import "./App.css";

function App() {
  // First useQuery param is query's name and second is an function  
  // isLoading from useQuery inform if query is being performed or is completed
  // This error constant will be populated after all retry requests return error
  const { data, isLoading, error } = useQuery('todos', () => {
    // Getting api response then getting data from api response
    return axios
      .get("http://localhost:8080/todos")
      .then((response) => response.data);
  },
  //If request provides an error, react-query can resend as many requests as you want
    {
      retry: 5,
      //refetchOnWindowFocus repeat request after user switch back browser tab 
      refetchOnWindowFocus: true,
      //refetchInterval gives a possibility to resend request from time to time, time in ms
      refetchInterval: 5000,
      //initialData starts with filled data so they are not empty
      initialData: [{id: "1", title: 'teste'}]
    }
  );
    
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