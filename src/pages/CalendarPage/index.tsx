import { useEffect } from "react";
import { useSelector } from "react-redux";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { fetchTodoList, fetchTodoListSelector } from "../../core/store/todoSlice";
import { useThunkDispatch } from "../../core/store/store";
import { CustomContentGenerator, EventContentArg } from "@fullcalendar/core/index.js";
import interactionPlugin, { Draggable } from "@fullcalendar/interaction";
import { Text } from "@chakra-ui/react";
import { updateDueDate } from "../../core/store/todoSlice";

const renderFunc: CustomContentGenerator<EventContentArg> = function (eventInfo) {
  return (
    <div>
      <Text>{eventInfo.timeText}</Text>
      <Text as="b">{eventInfo.event.title}</Text>
    </div>
  );
};

const CalendarPage = () => {
  const dispatch = useThunkDispatch();
  const { data: todos, status, error } = useSelector(fetchTodoListSelector);

  const events = todos.map((el) => {
    return {
      title: el.title,
      start: el.dueDate,
      id: el.id,
    };
  });
  console.log(events);

  useEffect(() => {
    dispatch(fetchTodoList());
  }, []);

  const onDrag = (info) => {
    console.log(info.event.title);
    const event = {
      id: info.event.id,
      time: info.event.timeStr,
    };
    dispatch(updateDueDate({ event }));
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
        eventDrop={(info) => onDrag(info)}
      />
    </div>
  );
};

export default CalendarPage;
