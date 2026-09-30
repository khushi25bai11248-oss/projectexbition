export default function FeatureCard({
  icon,
  title,
  description,
  color = "blue",
}) {
  const colorStyles = {
    blue: {
      card: "from-blue-50 via-white to-cyan-50 border-blue-100 hover:border-blue-300",
      icon: "from-blue-600 to-cyan-400",
      glow: "bg-blue-500/10",
      title: "group-hover:text-blue-600",
    },

    purple: {
      card: "from-violet-50 via-white to-blue-50 border-violet-100 hover:border-violet-300",
      icon: "from-violet-600 to-blue-500",
      glow: "bg-violet-500/10",
      title: "group-hover:text-violet-600",
    },

    pink: {
      card: "from-pink-50 via-white to-violet-50 border-pink-100 hover:border-pink-300",
      icon: "from-pink-500 to-violet-600",
      glow: "bg-pink-500/10",
      title: "group-hover:text-pink-600",
    },

    orange: {
      card: "from-orange-50 via-white to-pink-50 border-orange-100 hover:border-orange-300",
      icon: "from-orange-500 to-pink-500",
      glow: "bg-orange-500/10",
      title: "group-hover:text-orange-600",
    },
  };

  const styles = colorStyles[color] || colorStyles.blue;

  return (
    <div
      className={`group relative overflow-hidden rounded-3xl border bg-gradient-to-br p-7 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl ${styles.card}`}
    >

      {/* Background Glow */}

      <div
        className={`absolute -right-12 -top-12 h-32 w-32 rounded-full blur-3xl ${styles.glow}`}
      />

      {/* Icon */}

      <div
        className={`relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${styles.icon} text-2xl shadow-lg transition-transform duration-300 group-hover:scale-110`}
      >
        <span>{icon}</span>
      </div>


      {/* Content */}

      <div className="relative mt-6">

        <h3
          className={`text-xl font-bold text-slate-900 transition-colors duration-300 ${styles.title}`}
        >
          {title}
        </h3>

        <p className="mt-3 text-sm leading-7 text-slate-600">
          {description}
        </p>

      </div>


      {/* Bottom Accent */}

      <div
        className={`absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r ${styles.icon} transition-all duration-300 group-hover:w-full`}
      />

    </div>
  );
}