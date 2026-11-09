function StatusMessage({ children, type = "info" }) {

  return (
    <div
      className={`status-message ${type}`}
      role={type === "error" ? "alert" : "status"}
    >
      {children}
    </div>
  );
}

export default StatusMessage;
