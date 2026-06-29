export default function Loader() {
  return (
    <div
      id="loader-wrapper"
      role="status"
      aria-label="Loading application"
      aria-live="polite"
    >
      <div className="loader-card">
        <div className="spinner-ring"></div>

        <div className="logo-wrapper">
          <img
            src="/images/app_spinner.png"
            alt="Loading"
            className="spinner-image"
          />
        </div>
      </div>
    </div>
  );
}