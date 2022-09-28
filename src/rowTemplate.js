//A very simple template that just displays the Ticket

const rowTemplate = (item) => (
  <div className="item" key={item.index}>
    <div>{item.text}</div>
    <div>Subject</div>
    <div>Priority</div>
    <div>Status</div>
    <div>Description</div>
  </div>
);

export default rowTemplate;
