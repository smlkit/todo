import { FC, memo, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useThunkDispatch } from "../../core/store/store";
import { fetchTodoList, patchTodo, filterTodosSelector, Todo } from "../../core/store/todoSlice";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import {
  CustomContentGenerator,
  EventContentArg,
  EventDropArg,
  EventInput,
} from "@fullcalendar/core/index.js";
import interactionPlugin, { Draggable, EventReceiveArg } from "@fullcalendar/interaction";
import { Text, Box, Flex } from "@chakra-ui/react";
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

const ExternalEvent: FC<{ event: Todo }> = ({ event }) => {
  let elRef = useRef(null);

  useEffect(() => {
    let draggable = new Draggable(elRef.current, {
      eventData: function () {
        return { ...event, create: true };
      },
    });

    return () => draggable.destroy();
  });

  return (
    <Box ref={elRef} bg="teal" color="white" w="100px" padding={1.5} borderRadius={7} cursor="pointer">
      <strong>{event.title}</strong>
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

  const externalEvents: EventInput[] = withoutDate.map((el) => {
    return {
      editable: !el.isDone,
      title: el.title,
      id: el.id,
      backgroundColor: el.isDone ? "red" : "teal",
    };
  });

  const [externalEventsState, setExternalEventsState] = useState(externalEvents);

  const handleEventReceive = (event: any) => {
    const externalId = event.event._def.publicId;
    const test = {
      id: externalId,
      dueDate: moment(event.event._instance.range.start).format("YYYY-MM-DDThh:mm"),
    };
    dispatch(patchTodo(test))
      .unwrap()
      .finally(() => {
        setExternalEventsState(externalEvents.filter((event) => event.id !== externalId));
      });
  };

  useEffect(() => {
    dispatch(fetchTodoList());
  }, [externalEventsState]);

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
        <Flex gap={5} mb={5}>
          {externalEventsState.map((event) => (
            <ExternalEvent key={event.id} event={event}></ExternalEvent>
          ))}
        </Flex>
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          weekends={true}
          events={events}
          eventContent={renderFunc}
          editable={true}
          droppable={true}
          eventReceive={handleEventReceive}
          eventDrop={onDrag}
          eventColor="red"
          eventClick={(info) => navigate(`/${info.event.id}`)}
        />
      </Container>
    </Wrapper>
  );
};

export default CalendarPage;
