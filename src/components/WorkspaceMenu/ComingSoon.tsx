interface ComingSoonProps {
  title: string;
}

const ComingSoon = ({ title }: ComingSoonProps) => {
  return (
    <div style={{ padding: '1rem', color: '#fff' }}>
      <h2>{title}</h2>
      <p>Coming soon...</p>
    </div>
  );
};

export default ComingSoon;
