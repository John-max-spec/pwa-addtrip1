import { useState, useRef, useEffect } from "react";
import Form from "./components/Form";
import FilterButton from "./components/FilterButton";
import Todo from "./components/Todo";
import { nanoid } from "nanoid";
import HomePage from './pages/Home'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import TravelList from './components/TravelList';
import { BASE_URL } from './utils/config'
import axios from 'axios'
import { clearQueue, getQueue } from './utils/offlineQueue'
// import TravelItem from './components/TravelItem'
// import { TripProvider } from './context/TripContext'

function usePrevious(value) {
  const ref = useRef(null);
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

const FILTER_MAP = {
  All: () => true,
  Active: (task) => !task.completed,
  Completed: (task) => task.completed,
};

const FILTER_NAMES = Object.keys(FILTER_MAP);

export default function App(props) {



  useEffect(() => {
    const syncQueue = async () => {
      const queue = getQueue();

      for (const action of queue) {
        try {
          if (action.type === 'DELETE') {
            await axios.delete(`${BASE_URL}/api/trips/${action.id}`);
          } else if (action.type === 'UPDATE') {
            await axios.put(`${BASE_URL}/api/trips/${action.trip._id}`, action.trip);
          }
        } catch (err) {
          console.warn("Failed to sync action:", action, err);
        }
      }

      clearQueue();
    };

    window.addEventListener('online', syncQueue);
    return () => window.removeEventListener('online', syncQueue);
  }, []);



const geoFindMe = (onSuccess, onError) => {
  if (!navigator.geolocation) {
    console.log("Geolocation is not supported by your browser");
    return;
  }
  
  console.log("Locating…");
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
      onSuccess({
        latitude,
        longitude,
        mapURL: `https://www.openstreetmap.org/#map=18/${latitude}/${longitude}`,
        smsURL: `sms:?body=I'm at this location: https://www.openstreetmap.org/#map=18/${latitude}/${longitude}`,
        error: "",
      });
    },
    (error) => {
      console.error("Geolocation error:", error.message);
      if (onError) onError(error.message);
    }
  );
};






function usePersistedState(key, defaultValue) {
  const [state,setState]=useState(
    () =>JSON.parse(localStorage.getItem(key)) || defaultValue);

  useEffect(() =>{
    localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);
    return [state, setState];
  }

const [tasks, setTasks] = usePersistedState('tasks',[]);

  
  const [filter, setFilter] = useState("All");
const [lastInsertedId, setLastInsertedId]= useState("");






  function toggleTaskCompleted(id) {
    const updatedTasks = tasks.map((task) => {
      
      if (id === task.id) {
        
        return { ...task, completed: !task.completed };
      }
      return task;
    });
    setTasks(updatedTasks);
   
  }

  function deleteTask(id) {
    const remainingTasks = tasks.filter((task) => id !== task.id);
    setTasks(remainingTasks);
    
  }

  function editTask(id, newName) {
    const editedTaskList = tasks.map((task) => {
    
      if (id === task.id) {
        
        return { ...task, name: newName };
      }
      
      return task;
    });
    setTasks(editedTaskList);
    
  }

function locateTask(id, location) {
  setTasks((prevTasks) =>
    prevTasks.map((task) =>
      task.id === id ? { ...task, location } : task
    )
  );

  const locatedTaskList = tasks.map((task) => {
    if (id === task.id) {
      console.log("Updating task:", task);
      return { ...task, location: location }; 
    }
    return task;
  });

  console.log("Updated tasks:", locatedTaskList);
  setTasks(locatedTaskList); 
}


function photoedTask(id) {
 console.log("photoedTask", id);
 const photoedTaskList = tasks.map((task) => {
if (id === task.id) {
 
 return { ...task, photo: true };
 }
 return task;
 });
 console.log(photoedTaskList);
 setTasks(photoedTaskList); 
}


  const taskList = tasks
  ?.filter(FILTER_MAP[filter])
  .map((task) => (
  <Todo 
    id={task.id}
    name={task.name}
    completed={task.completed}
    key={task.id}
    location = {task.location}
    toggleTaskCompleted={toggleTaskCompleted}
    latitude={task.location?.latitude || "Unknown"} 
  longitude={task.location?.longitude || "Unknown"}
    photoedTask={photoedTask}
    deleteTask={deleteTask}
    editTask={editTask} 
  />
));

  const filterList = FILTER_NAMES.map((name) => (
    <FilterButton
      key={name}
      name={name}
      isPressed={name === filter}
      setFilter={setFilter}
    />
  ));

 const addTask = async (name) => {
  const id = "todo-" + nanoid(); 
  const newTask = {
    id: id,
    name: name,
    completed: true,
    location: { latitude: "", longitude: "", error: "" },
  };

  
  setTasks((prevTasks) => [...prevTasks, newTask]);
  setLastInsertedId(id);

  
  geoFindMe(
    (location) => {
      
      locateTask(id, location); 
      console.log("Geo location added to task:", location);
    },
    (error) => {
      console.error("Failed to get location for task:", id, error);
    }
  );

  try {
    await axios.post(`${BASE_URL}/api/trips/add-trip`, newTask);
    console.log("Task successfully added to the backend!");
  } catch (err) {
    console.error("Failed to add task to the backend:", err);
  }
};

  
  const tasksNoun = taskList.length !== 1 ? "tasks" : "task";
  const headingText = `${taskList.length} ${tasksNoun} remaining`;

  const listHeadingRef = useRef(null);
  const prevTaskLength = usePrevious(tasks.length);

  useEffect(() => {
    if (tasks.length < prevTaskLength) {
      listHeadingRef.current.focus();
    }
  }, [tasks.length, prevTaskLength]);

    return (
      <div>

        <Routes>
        
        <Route path="/" element={<HomePage />} />
        {/* <Route
          path="/trip-list"
          element={<TravelList tasks={tasks} setTasks={setTasks} />}
        />
        <Route path="/trip-item" element={<TravelItem />} /> */}
        <Route
          path="/todo"
          element={
 <div className="todoapp stack-large">
 <h1>Add a New Trip</h1>
 <Form addTask={addTask} geoFindMe={geoFindMe} />{" "}
 <div className="filters btn-group stack-exception">{filterList}</div>
 <h2 id="list-heading" tabIndex="-1" ref={listHeadingRef}>
 {headingText}
 </h2>
 <ul
 aria-labelledby="list-heading"
 className="todo-list stack-large stack-exception"
 role="list"
 >
 {taskList}
 </ul>
 </div>
 }

/>
 
    

        
      </Routes>
    
    </div>
  );

}


