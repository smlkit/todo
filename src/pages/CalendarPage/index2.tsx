import { EventContentArg, EventDropArg } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin, { Draggable } from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import { Box, Button, Container, Typography } from "@mui/material";
import dayjs from "dayjs";
import { FC, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { dragTodo, selectFiltredTodo } from "../../core/store/slices/todosSlice";
import { useThunkDispatch } from "../../core/store/store";

const ExternalEvent: FC<{ event: any }> = ({ event }) => {
  let elRef = useRef<HTMLDivElement | null>(null);

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
      title={event.title}
      height="20px"
      width="150px"
      borderRadius="5px"
      // backgroundColor={event.backgroundColor}
    >
      <strong>{event.title}</strong>
    </Box>
  );
};

function renderEventContent(eventInfo: EventContentArg) {
  return (
    <Box display="flex" alignItems="center" justifyContent="center">
      <Typography textAlign="center">{eventInfo.timeText}</Typography>
      <Typography>{eventInfo.event.title}</Typography>
    </Box>
  );
}

const CalendarPage = () => {
  const dispatch = useThunkDispatch();

  const onDrag = (info: EventDropArg) => {
    const event = {
      id: info.event.id,
      deadline: info.event.startStr,
    };
    dispatch(dragTodo(event));
  };

  const { withDate, withoutDate } = useSelector(selectFiltredTodo);

  const eventsWithoutDate = withoutDate.map((item) => {
    return {
      editable: !item.isDone,
      title: item.title,
      id: item.id,
      backgroundColor: item.isDone ? "darkslateblue" : "violet",
    };
  });

  console.log(eventsWithoutDate, "without");

  const eventsWithDate = withDate.map((item) => ({
    editable: !item.isDone,
    title: item.title,
    id: item.id,
    start: dayjs(item.deadline).format("YYYY-MM-DD"),
    backgroundColor: item.isDone ? "teal" : "olive",
  }));

  const [externalEvents, setExternalEvents] = useState<typeof eventsWithoutDate>([]);

  useEffect(() => {
    if (eventsWithoutDate.length && !externalEvents.length) {
      setExternalEvents(eventsWithoutDate);
    }
  }, [externalEvents, eventsWithoutDate]);

  const handleEventReceive = (event: any) => {
    const externalId = event.event._def.publicId;
    const test = {
      id: externalId,
      deadline: dayjs(event.event._instance.range.start).format("YYYY-MM-DD"),
    };
    dispatch(dragTodo(test))
      .unwrap()
      .finally(() => {
        setExternalEvents(eventsWithoutDate.filter((event: any) => event.id !== externalId));
      });
  };

  return (
    <>
      <Link to="/" style={{ alignSelf: "end", marginRight: "10px" }}>
        <Button variant="contained">Back</Button>
      </Link>
      <Container maxWidth="lg">
        <Box id="external-events">
          {externalEvents.map((event) => (
            <ExternalEvent key={event.id} event={event} />
          ))}
        </Box>
        <Box display="flex" flexDirection="column" gap="30px">
          <Box display="flex" justifyContent="end"></Box>
          <FullCalendar
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "",
            }}
            plugins={[dayGridPlugin, interactionPlugin]}
            droppable={true}
            initialView="dayGridMonth"
            weekends={true}
            editable={true}
            events={eventsWithDate}
            eventReceive={handleEventReceive}
            eventContent={renderEventContent}
            eventDrop={onDrag}
          />
        </Box>
      </Container>
    </>
  );
};

export default CalendarPage;
