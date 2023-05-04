import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useThunkDispatch } from "../../core/store/store";
import {
  fetchTodoList,
  fetchTodoListSelector,
  patchTodo,
  filterTodosSelector,
} from "../../core/store/todoSlice";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import {
  CustomContentGenerator,
  EventContentArg,
  EventDropArg,
  EventInput,
  EventSourceInput,
} from "@fullcalendar/core/index.js";
import interactionPlugin from "@fullcalendar/interaction";
import { Text, Box } from "@chakra-ui/react";
import { Wrapper } from "../../styles/styledComponents/Wrapper";
import { Container } from "../../styles/styledComponents/Container";
import moment from "moment";

const renderFunc: CustomContentGenerator<EventContentArg> = function (eventInfo) {
  return (
    <Box width="100%" backgroundColor={eventInfo.backgroundColor} borderRadius="5px" padding="5px">
      <Text color="white">{eventInfo.timeText}</Text>
      <Text as="b" color="white" fontSize="md">
        {eventInfo.event.title}
      </Text>
    </Box>
  );
};

const CalendarPage = () => {
  const navigate = useNavigate();
  const dispatch = useThunkDispatch();
  const { withDate, withoutDate, status, error } = useSelector(filterTodosSelector);

  const events: EventInput[] = withDate.map((el) => {
    return {
      editable: !el.isDone,
      title: el.title,
      start: moment(el.dueDate).toDate(),
      id: el.id,
      backgroundColor: el.isDone ? "darkgrey" : "teal",
    };
  });
  console.log(events);

  const externalEvents: EventInput[] = withoutDate.map((el) => {
    return {
      editable: !el.isDone,
      title: el.title,
      id: el.id,
      backgroundColor: el.isDone ? "red" : "teal",
    };
  });
  console.log(externalEvents);

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
    <Wrapper>
      <Container>
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
      </Container>
    </Wrapper>
  );
};

export default CalendarPage;
