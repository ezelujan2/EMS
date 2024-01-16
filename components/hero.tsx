async function checkIfLive() 
{
  const CLIENT_ID = 'u88omynuct39nv6n55d5jkts0x0d9c'; // Reemplaza con tu Client ID de Twitch
  const CLIENT_SECRET = '87x92kwb252h175qoz8nfis93w1k6z'; // Reemplaza con tu Client Secret de Twitch
  const GRANT_TYPE = "client_credentials"
  const USERNAME = 'kinghert1';
  let TOKEN = ''

  let url = 'https://id.twitch.tv/oauth2/token';

const params = new URLSearchParams();
params.append('client_id', CLIENT_ID);
params.append('client_secret', CLIENT_SECRET);
params.append('grant_type', GRANT_TYPE);

fetch(url, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  body: params
})
.then(response => response.json())
.then(data => {
  TOKEN = data.access_token; 
})
.catch(error => {
  console.error('Error al obtener el token de acceso:', error);
  return
});

  url = `https://api.twitch.tv/helix/users?id=231024246`;

  const token = await fetch(`https://id.twitch.tv/oauth2/${TOKEN}`)
  

  fetch(url, {
    headers: {
      'Authorization': `Bearer ${TOKEN}`,
      'Client-ID': CLIENT_ID,
    }
  })
  .then(response => response.json())
  .then(data => {
    if (data.data && data.data.length > 0) {
      console.log(data)
      const streamInfo = data.data[0];
      if (streamInfo.type === 'live') {
        console.log('En vivo')
        return true
      } else {
        return false
      }
    } else {
      console.log(data)
      return false
    }
  })
  .catch(error => {
    console.error('Error al obtener información del stream:', error);
  });
  
}

export default  async function Hero() {
  let islive = await checkIfLive();

  return (
    <section className="relative">

      {/* Illustration behind hero content */}
      <div className="absolute left-1/2 transform -translate-x-1/2 bottom-0 pointer-events-none -z-1" aria-hidden="true">
        <svg width="1360" height="578" viewBox="0 0 1360 578" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient x1="50%" y1="0%" x2="50%" y2="100%" id="illustration-01">
              <stop stopColor="#FFF" offset="0%" />
              <stop stopColor="#EAEAEA" offset="77.402%" />
              <stop stopColor="#DFDFDF" offset="100%" />
            </linearGradient>
          </defs>
          <g fill="url(#illustration-01)" fillRule="evenodd">
            <circle cx="1232" cy="128" r="128" />
            <circle cx="155" cy="443" r="64" />
          </g>
        </svg>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        {/* Hero content */}
        <div className="pt-32 pb-12 md:pt-40 md:pb-20">

          {/* Section header */}
          <div className="text-center pb-12 md:pb-16">
            <h1 className="text-5xl md:text-6xl font-extrabold leading-tighter tracking-tighter mb-4" data-aos="zoom-y-out"><span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400">E</span>scuela <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400">M</span>inisterio <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400">S</span>obrenatural</h1>
            <div className="max-w-3xl mx-auto">
              <p className="text-xl text-gray-600 mb-8" data-aos="zoom-y-out" data-aos-delay="150">El Reino de Dios se ha acercado.</p>
              <div className="max-w-xs mx-auto sm:max-w-none sm:flex sm:justify-center" data-aos="zoom-y-out" data-aos-delay="300">
                <div>
                  <a className="btn text-white bg-blue-600 hover:bg-blue-700 w-full mb-4 sm:w-auto sm:mb-0" href="#0">Testimonios</a>
                </div>
                <div>
                  <a className="btn text-white bg-gray-900 hover:bg-gray-800 w-full sm:w-auto sm:ml-4" href="#0">Incripciones</a>
                </div>
              </div>
            </div>
          </div>

          {/* Hero image */}
          {/* <ModalVideo
            thumb={VideoThumb}
            thumbWidth={768}
            thumbHeight={432}
            thumbAlt="Modal video thumbnail"
            video="/videos/video.mp4"
            videoWidth={1920}
            videoHeight={1080} /> */}
            <iframe
            id="twitch-iframe"
            src="https://player.twitch.tv/?channel=kinghert1&parent=localhost&muted=false&controls=false"
            frameBorder="0"
            allowFullScreen={true}
            scrolling="no"
            height="378"
            width="620"
          ></iframe>
          : "" 
          
          

        </div>

      </div>
    </section>
  )
}