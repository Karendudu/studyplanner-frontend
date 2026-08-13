interface Props {
  title: string;
  subtitle: string;
}

function PageHeader({ title, subtitle }: Props) {
  return (
    <div className="mb-8 max-w-3xl">

      <h1 className="text-4xl font-bold text-primary dark:text-surface">
        {title}
      </h1>

      <p className="text-gray-500 mt-2 dark:text-gray-400">
        {subtitle}
      </p>

    </div>
  );
}

export default PageHeader;