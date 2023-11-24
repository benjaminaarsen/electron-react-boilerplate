import { JSX, useState } from 'react';
import { Message, Signal } from 'dbc-can/lib/dbc/Dbc';
import { Card, Form } from 'react-bootstrap';

function InputRange({ signal }: { signal: Signal }) {
  const [rangeValue, setRangeValue] = useState(0);
  const handleChange = (e) => {
    setRangeValue(e.target.value);
  };
  return (
    <>
      <span key={signal.name} className="d-flex justify-content-between">
        <Form.Label className="text-wrap w-70">{`${signal.name}`}</Form.Label>
        <Form.Text className="text-wrap user-select-none">{`${rangeValue}`}</Form.Text>
      </span>
      <Form.Range
        key={`${signal.name} range`}
        value={rangeValue}
        min={0}
        max={2 ** signal.length - 1}
        onChange={handleChange}
      />
    </>
  );
}

export default function Cards({
  messages,
}: {
  messages: Map<string, Message>;
}) {
  const oneBitSignal = (signal: Signal) => {
    return (
      <span key={signal.name} className="d-flex justify-content-between">
        <Form.Label className="text-wrap w-90">{`${signal.name}`}</Form.Label>
        <Form.Check type="checkbox" />
      </span>
    );
  };
  const twoBitSignal = (signal: Signal) => {
    return (
      <span key={signal.name} className="d-flex justify-content-between">
        <Form.Label className="text-wrap w-60">{`${signal.name}`}</Form.Label>
        <Form.Label className="text-wrap">Bit 0: </Form.Label>
        <Form.Check type="checkbox" />
        <Form.Label className="text-wrap">Bit 1: </Form.Label>
        <Form.Check type="checkbox" />
      </span>
    );
  };
  const cards: JSX.Element[] = [];
  messages.forEach((message) => {
    const signals: JSX.Element[] = [];
    message.signals.forEach((signal) => {
      signals.push(
        <>
          {(() => {
            if (signal.length === 1) {
              return oneBitSignal(signal);
            }
            if (signal.length === 2) {
              return twoBitSignal(signal);
            }
            return InputRange({ signal });
          })()}
        </>,
      );
    });

    cards.push(
      <Card
        key={message.name}
        className="g-col-12 g-col-sm-6 g-col-md-4 g-col-lg-3 g-col-xxl-2 shade-0 border-0"
      >
        <Card.Body>
          <Card.Title>{`${message.name} 0x${message.id.toString(
            16,
          )}`}</Card.Title>
          {signals}
        </Card.Body>
      </Card>,
    );
  });
  return cards;
}
