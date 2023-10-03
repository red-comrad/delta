import { useEffect, useState } from "react";
import { useRef } from "react";

function App() {
  return (
    <>
      <Todoapp />
    </>
  );
}

function Todoapp(props) {
  const taskTitle = useRef();
  const taskDesc = useRef();
  const glEditRef = useRef();
  const [filter, setFilter] = useState("");
  const [glid, setGlid] = useState(0);
  const [taskView, setTaskView] = useState([]);

  const addHandler = () => {
    let obj = {
      title: taskTitle.current.value,
      desc: taskDesc.current.value,
      id: glid,
    };
    if (obj.title.length === 0 || obj.desc.length === 0) {
      alert("empty title or empty description");
      return;
    }
    taskTitle.current.value = "";
    taskDesc.current.value = "";
    setTaskView([...taskView, obj]);
    setGlid(glid + 1);
  };

  useEffect(() => {
    let obj = localStorage.getItem("cache");
    if (obj == null) obj = [];
    else obj = JSON.parse(obj);
    setTaskView(obj);
    console.log("data global load", taskView);
  }, []);

  return (
    <>
      <div class="container">
        <div class="form__row">
          <label>Title:</label>
          <input placeholder="title of task" ref={taskTitle} />
        </div>
        <div class="form__row">
          <label>Description:</label>
          <input placeholder="description of task" ref={taskDesc} />
        </div>
        <div class="form__row">
          <button onClick={addHandler}>Add</button>
        </div>
      </div>
      <TaskFilter setFilter={setFilter} />
      <TaskView editRef={glEditRef} filter={filter} taskView={taskView} setTaskView={setTaskView} />
      <TaskEdit editRef={glEditRef} />
    </>
  );
}

function TaskEdit(props) {

  const handler = (e) => {
    props.editRef.current.style.display = "none";
  };

  return (
    <>
      <div class="global-edit" ref={props.editRef}>
        this is global edit
        <button onClick={handler}>Click Me To Exit</button>
      </div>
    </>
  );
}

function TaskFilter(props) {
  const [time, setTime] = useState(0);

  const filterHandler = (e) => {
    let val = e.target.value;
    try {
      clearTimeout(time);
      let newTime = setTimeout(() => {
        props.setFilter(val);
        console.log(val);
      }, 1200);
      setTime(newTime);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      <div class="container">
        <div>
          <label>Filter on key:</label>
          <input
            onInputCapture={filterHandler}
            placeholder="enter title substring"
          ></input>
        </div>
      </div>
    </>
  );
}

function TaskView(props) {
  let ret = [];
  props.taskView.forEach((e) => {
    if (e.title.includes(props.filter)) {
      ret.push(e);
    }
  });

  const deleteHandler = (id) => {
    let ret = [];
    props.taskView.forEach((elem) => {
      if (elem.id === id) {
        return;
      }
      ret.push(elem);
    });
    props.setTaskView(ret);
    alert("task deleted");
  };

  const editHandler = (id) => {
    let ret = [];
    props.taskView.forEach((elem) => {
      ret.push(elem);
    });
    props.editRef.current.style.display = "block";
    props.setTaskView(ret);
  };

  let view;
  if (ret.length === 0) {
    view = (
      <>
        <div class="content__row">
          <div class="content__row__element element__body">No Result</div>
        </div>
      </>
    );
  } else {
    view = (
      <>
        {ret.map((e, i) => {
          return (
            <div class="content__row" key={e.id}>
              <div class="content__row__element element__title">
                {i + 1}. {e.title}
              </div>
              <div class="content__row__element element__body">{e.desc}</div>
              <div class="content__row__element element__action">
                <button
                  onClick={() => {
                    editHandler(e.id);
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    deleteHandler(e.id);
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </>
    );
  }

  return (
    <>
      <div class="container">{view}</div>
    </>
  );
}

export default App;
