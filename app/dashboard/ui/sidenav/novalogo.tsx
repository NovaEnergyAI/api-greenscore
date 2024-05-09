import { lusitana } from '../fonts';

export default function NovaLogo() {
  return (
    <div className={`nova-logo ${lusitana.className}`}>
      <p className="nova-logo__text">Nova</p>
    </div>
  );
}
