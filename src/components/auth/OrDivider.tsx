export function OrDivider() {
  return (
    <div className="flex items-center gap-3 my-5">
      <div className="h-px flex-1 bg-line" />
      <span className="text-xs font-medium text-faint">or</span>
      <div className="h-px flex-1 bg-line" />
    </div>
  );
}
