import { Box, Flex, Text } from "@chakra-ui/react";
import {
  CustomContentGenerator,
  EventContentArg,
  EventDropArg,
  EventInput,
} from "@fullcalendar/core/index.js";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin, { Draggable } from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import moment from "moment";
import { FC, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useThunkDispatch } from "../../core/store/store";
import { Todo, fetchTodoList, filterTodosSelector, patchTodo } from "../../core/store/todoSlice";
import { Container } from "../../styles/styledComponents/Container";
import { Wrapper } from "../../styles/styledComponents/Wrapper";

const renderFunc: CustomContentGenerator<EventContentArg> = function (eventInfo) {
  return (
    <Box width="100%" backgroundColor={eventInfo.backgroundColor} borderRadius="5px" padding="5px">
      {/* <Text color="white">{eventInfo.e}</Text> */}
      <Text as="b" color="white" fontSize="md">
        {eventInfo.event.title}
      </Text>
    </Box>
  );
};

const ExternalEvent: FC<{ event: any }> = ({ event }) => {
  let elRef = useRef(null);

  useEffect(() => {
    if (elRef.current) {
      let draggable = new Draggable(elRef.current, {
        eventData: function () {
          return { ...event, create: true };
        },
      });

      return () => draggable.destroy();
    }
  });

  return (
    <Box
      ref={elRef}
      bg="teal"
      color="white"
      w="100px"
      padding={1.5}
      borderRadius={7}
      cursor="pointer"
      textAlign="center"
    >
      <strong>{event.title}</strong>
    </Box>
  );
};

const CalendarPage = () => {
  const navigate = useNavigate();
  const dispatch = useThunkDispatch();

  const onDrag = (info: EventDropArg) => {
    const event = {
      id: info.event.id,
      dueDate: info.event.startStr,
    };

    dispatch(patchTodo(event));
  };

  const [externalEvents, setExternalEvents] = useState<typeof eventsWithoutDate>([]);

  useEffect(() => {
    dispatch(fetchTodoList());
  }, [externalEvents]);

  const { withDate, withoutDate } = useSelector(filterTodosSelector);

  const eventsWithDate = withDate.map((el) => {
    return {
      editable: !el.isDone,
      title: el.title,
      start: moment(el.dueDate).toDate(),
      id: el.id,
      backgroundColor: el.isDone ? "darkgrey" : "teal",
    };
  });

  const eventsWithoutDate = withoutDate.map((el) => {
    return {
      editable: !el.isDone,
      title: el.title,
      id: el.id,
      backgroundColor: el.isDone ? "darkgrey" : "teal",
    };
  });

  useEffect(() => {
    if (eventsWithoutDate.length && !externalEvents.length) {
      setExternalEvents(eventsWithoutDate);
    }
  }, []);

  const handleEventReceive = (event: any) => {
    const externalId = event.event._def.publicId;
    const test = {
      id: externalId,
      dueDate: moment(event.event._instance.range.start).format("YYYY-MM-DDThh:mm"),
    };
    dispatch(patchTodo(test))
      .unwrap()
      .finally(() => {
        setExternalEvents(eventsWithoutDate.filter((event) => event.id !== externalId));
      });
  };

  return (
    <Wrapper>
      <Container>
        <Flex gap={5} mb={5}>
          {externalEvents.map((event) => (
            <ExternalEvent key={event.id} event={event}></ExternalEvent>
          ))}
        </Flex>
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          weekends={true}
          events={eventsWithDate}
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
