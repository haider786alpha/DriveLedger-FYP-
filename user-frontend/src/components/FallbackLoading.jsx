import IconifyIcon from "@/components/wrappers/IconifyIcon";

const FallbackLoading = () => {
  return (
    <div className="driveledger-loader-page">
      <div className="driveledger-loader-bg driveledger-loader-bg-one" />
      <div className="driveledger-loader-bg driveledger-loader-bg-two" />

      <div className="driveledger-loader-card">
        <div className="driveledger-loader-logo-row">
          <div className="driveledger-loader-mark">
            <IconifyIcon icon="mdi:routes" />
          </div>

          <div>
            <h1>DriveLedger</h1>
            <p>Loading your dashboard</p>
          </div>
        </div>

        <div className="driveledger-loader-progress">
          <span />
        </div>

        {/* <div className="driveledger-loader-note">
          Preparing your premium driver workspace...
        </div> */}
      </div>

      <style>
        {`
          .driveledger-loader-page {
            position: fixed;
            inset: 0;
            z-index: 99999;
            min-height: 100vh;
            background:
              radial-gradient(circle at 20% 15%, rgba(37, 99, 235, 0.12), transparent 28%),
              radial-gradient(circle at 82% 28%, rgba(79, 70, 229, 0.1), transparent 30%),
              linear-gradient(135deg, #ffffff 0%, #f8fbff 48%, #eef5ff 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
          }

          .driveledger-loader-bg {
            position: absolute;
            border-radius: 999px;
            filter: blur(4px);
            pointer-events: none;
          }

          .driveledger-loader-bg-one {
            width: 280px;
            height: 280px;
            top: -90px;
            right: -70px;
            background: rgba(37, 99, 235, 0.09);
          }

          .driveledger-loader-bg-two {
            width: 260px;
            height: 260px;
            left: -80px;
            bottom: -90px;
            background: rgba(79, 70, 229, 0.08);
          }

          .driveledger-loader-card {
            position: relative;
            width: min(92vw, 430px);
            padding: 26px;
            border-radius: 30px;
            background:
              radial-gradient(circle at 96% 8%, rgba(37, 99, 235, 0.1), transparent 30%),
              linear-gradient(135deg, rgba(255,255,255,0.94) 0%, rgba(248,251,255,0.94) 100%);
            border: 1px solid #dbeafe;
            box-shadow:
              0 30px 70px rgba(15, 23, 42, 0.14),
              inset 0 1px 0 rgba(255, 255, 255, 0.95);
            animation: driveledgerLoaderPop 0.7s ease both;
          }

          .driveledger-loader-logo-row {
            display: flex;
            align-items: center;
            gap: 15px;
          }

          .driveledger-loader-mark {
            width: 58px;
            height: 58px;
            min-width: 58px;
            border-radius: 20px;
            background:
              radial-gradient(circle at 30% 25%, rgba(255, 255, 255, 0.82), transparent 30%),
              linear-gradient(135deg, #2563eb 0%, #4338ca 100%);
            color: #ffffff;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 30px;
            box-shadow:
              0 18px 34px rgba(37, 99, 235, 0.25),
              inset 0 1px 0 rgba(255, 255, 255, 0.28);
            animation: driveledgerLogoPulse 1.8s ease-in-out infinite;
          }

          .driveledger-loader-mark svg {
            width: 1em;
            height: 1em;
            display: block;
          }

          .driveledger-loader-card h1 {
            margin: 0;
            color: #0f172a;
            font-size: 29px;
            line-height: 1;
            font-weight: 950;
            letter-spacing: -0.045em;
          }

          .driveledger-loader-card p {
            margin: 7px 0 0 0;
            color: #64748b;
            font-size: 13px;
            font-weight: 800;
          }

          .driveledger-loader-progress {
            position: relative;
            overflow: hidden;
            height: 10px;
            margin-top: 24px;
            border-radius: 999px;
            background: #e2e8f0;
            border: 1px solid #dbeafe;
          }

          .driveledger-loader-progress span {
            position: absolute;
            inset: 0 auto 0 0;
            width: 42%;
            border-radius: inherit;
            background: linear-gradient(90deg, #2563eb 0%, #4f46e5 100%);
            box-shadow: 0 8px 18px rgba(37, 99, 235, 0.25);
            animation: driveledgerProgress 1.25s ease-in-out infinite;
          }

          .driveledger-loader-note {
            margin-top: 14px;
            padding: 12px 14px;
            border-radius: 16px;
            background: #eff6ff;
            border: 1px solid #bfdbfe;
            color: #1d4ed8;
            font-size: 13px;
            font-weight: 850;
            text-align: center;
          }

          @keyframes driveledgerLoaderPop {
            from {
              opacity: 0;
              transform: translateY(20px) scale(0.97);
            }

            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }

          @keyframes driveledgerLogoPulse {
            0%, 100% {
              transform: translateY(0);
              box-shadow:
                0 18px 34px rgba(37, 99, 235, 0.25),
                inset 0 1px 0 rgba(255, 255, 255, 0.28);
            }

            50% {
              transform: translateY(-2px);
              box-shadow:
                0 22px 42px rgba(37, 99, 235, 0.32),
                inset 0 1px 0 rgba(255, 255, 255, 0.28);
            }
          }

          @keyframes driveledgerProgress {
            0% {
              left: -45%;
              width: 42%;
            }

            50% {
              width: 55%;
            }

            100% {
              left: 105%;
              width: 42%;
            }
          }

          @media (max-width: 576px) {
            .driveledger-loader-card {
              width: calc(100vw - 34px);
              padding: 22px;
              border-radius: 26px;
            }

            .driveledger-loader-mark {
              width: 52px;
              height: 52px;
              min-width: 52px;
              border-radius: 18px;
              font-size: 27px;
            }

            .driveledger-loader-card h1 {
              font-size: 25px;
            }

            .driveledger-loader-note {
              font-size: 12px;
            }
          }
        `}
      </style>
    </div>
  );
};

export default FallbackLoading;