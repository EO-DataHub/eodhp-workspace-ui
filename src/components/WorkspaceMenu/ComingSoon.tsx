interface ComingSoonProps {
  title: string;
}

const ComingSoon = ({ title }: ComingSoonProps) => {
  return (
    <div className="content-page" style={{ color: '#fff' }}>
      <h2>{title}</h2>
      <p>The {title} page is still under construction. Please check back later or get in touch.</p>
    </div>
  );
};

export default ComingSoon;
