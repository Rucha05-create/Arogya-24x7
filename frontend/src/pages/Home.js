import { useNavigate } from "react-router-dom"



function Home() {

  const navigate =
    useNavigate()

  let user = null;

try {

  const storedUser = localStorage.getItem("user");

  if (storedUser && storedUser !== "undefined") {

    user = JSON.parse(storedUser);

  }

} catch (error) {

  console.log("Invalid user in localStorage");

}

  const tests = [

    "Blood Test",

    "Diabetes Test",

    "Thyroid Profile",

    "COVID-19 Test",

    "Vitamin Test",

    "Liver Function Test"

  ]

  const handleBooking =
    testName => {

      if (!user) {

        alert(
          "Please create account first"
        )

        navigate("/client/register")

        return

      }

      localStorage.setItem(
        "selectedTest",
        testName
      )

      navigate(
        "/book"
      )

    }

  return (

    <div>

      <section
        className=
        "hero-section"
      >

        <div
          className=
          "hero-content">
          <h1>
            Advanced Global
            Pathology Services

          </h1>

          <p>

            Book medical tests
            online, access reports
            instantly and maintain
            complete medical history
            securely.

          </p>

        </div>

      </section>

      <section
        className=
        "services-section"
      >

        <h2>

          Popular Lab Tests

        </h2>

        <div
          className=
          "services-grid"
        >

          {

            tests.map(
              (
                test,
                index
              ) => (

                <div
                  key={index}

                  className=
                  "service-card"
                >

                  <h3>

                    {test}

                  </h3>

                  <p>

                    Accurate and
                    reliable
                    pathology
                    testing.

                  </p>

                  <button
                    onClick={
                      () =>
                      handleBooking(
                        test
                      )
                    }
                  >

                    Book Test

                  </button>

                </div>

              )
            )

          }

        </div>

      </section>

      <section
        className=
        "feature-section"
      >

        <div
          className=
          "feature-box"
        >

          <h3>

            🌍 Worldwide Access

          </h3>

          <p>

            Users across the world
            can book tests online.

          </p>

        </div>

        <div
          className=
          "feature-box"
        >

          <h3>

            📄 Digital Reports

          </h3>

          <p>

            Access pathology
            reports instantly.

          </p>

        </div>

        <div
          className=
          "feature-box"
        >

          <h3>

            🔒 Secure Records

          </h3>

          <p>

            Maintain complete
            medical history.

          </p>

        </div>

      </section>

    </div>

  )

}

export default Home