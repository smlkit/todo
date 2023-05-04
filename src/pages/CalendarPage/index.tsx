import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useThunkDispatch } from "../../core/store/store";
import { fetchTodoList, fetchTodoListSelector, patchTodo } from "../../core/store/todoSlice";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import {
  CustomContentGenerator,
  EventContentArg,
  EventDropArg,
  EventSourceInput,
} from "@fullcalendar/core/index.js";
import interactionPlugin, { Draggable } from "@fullcalendar/interaction";
import { Text } from "@chakra-ui/react";

const renderFunc: CustomContentGenerator<EventContentArg> = function (eventInfo) {
  return (
    <div style={{ width: "100%", backgroundColor: eventInfo.backgroundColor }}>
      <Text color="white">{eventInfo.timeText}</Text>
      <Text as="b" color="white" fontSize="md">
        {eventInfo.event.title}
      </Text>
    </div>
  );
};

const CalendarPage = () => {
  const navigate = useNavigate();
  const dispatch = useThunkDispatch();
  const { data: todos, status, error } = useSelector(fetchTodoListSelector);

  const events: EventSourceInput = todos.map((el) => {
    return {
      editable: !el.isDone,
      title: el.title,
      start: el.dueDate,
      id: el.id,
      backgroundColor: el.isDone ? "red" : "teal",
    };
  });

  useEffect(() => {
    dispatch(fetchTodoList());
  }, []);

  const onDrag = (info: EventDropArg) => {
    const event = {
      id: info.event.id,
      dueDate: info.event.startStr,
    };

    dispatch(patchTodo(event));
  };

  return (
    <div>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        weekends={true}
        events={events}
        eventContent={renderFunc}
        editable={true}
        droppable={true}
        eventDrop={onDrag}
        eventColor="red"
        eventClick={(info) => navigate(`/${info.event.id}`)}
      />
    </div>
  );
};

export default CalendarPage;
