<script>
	import { setContext } from 'svelte';

	import User from './User.svelte';
	import Markdown from './Markdown.svelte';
	import Annotations from './Annotations.svelte';
	import Highlighter from './Highlighter.svelte';

	import { annotations } from './annotation-store.js';
	import { user } from './user-store.js';

	// TODO: Implement auth. Only need to auth just-in-time when updating. Shouldn’t require auth to view.
	$user = {
		name: 'jmakeig',
		fullName: 'Justin Makeig',
		avatar: null
	};

	setContext('user', user);

	const dummy = `Kale chips art party subway tile, everyday carry bushwick slow-carb retro viral post-ironic waistcoat chillwave adaptogen kogi literally. Cray viral tofu fanny pack kale chips tumeric gentrify edison bulb ennui chicharrones VHS health goth. You probably haven't heard of them hoodie small batch forage sustainable, distillery aesthetic occupy mixtape disrupt normcore. Yuccie meditation ethical palo santo sustainable. Kinfolk bitters biodiesel poke put a bird on it wayfarers lomo hexagon single-origin coffee. Tbh single-origin coffee actually succulents.

Kogi cronut pok pok umami artisan live-edge literally. Organic fashion axe church-key, portland raw denim hell of blue bottle farm-to-table paleo YOLO brunch pok pok gochujang post-ironic. Gentrify locavore williamsburg, gluten-free blue bottle art party poutine coloring book sriracha fixie cornhole before they sold out. Glossier hot chicken disrupt affogato, ugh seitan banh mi selvage shabby chic. Tumblr pabst glossier cold-pressed banjo kinfolk kickstarter fingerstache actually, polaroid succulents master cleanse food truck. Kogi 90's ennui post-ironic gochujang pickled. Kogi intelligentsia air plant, tofu hella la croix master cleanse.

Hella four dollar toast sartorial, scenester yuccie wolf ethical tattooed pickled vegan VHS. Plaid asymmetrical vexillologist tumeric chillwave, retro farm-to-table. Master cleanse authentic affogato tumblr literally, twee poutine 3 wolf moon. Typewriter scenester street art meh jianbing. Shoreditch coloring book microdosing listicle wayfarers wolf letterpress. Art party butcher humblebrag lumbersexual master cleanse green juice. Lyft echo park leggings messenger bag vice.

Swag lo-fi echo park, letterpress lumbersexual freegan kale chips. Banjo butcher farm-to-table franzen authentic freegan deep v green juice viral distillery marfa hell of schlitz hashtag street art. Slow-carb thundercats pug la croix poke. Wayfarers etsy taiyaki hot chicken slow-carb kombucha. Affogato chambray enamel pin taiyaki four dollar toast semiotics food truck. Truffaut deep v yuccie, offal air plant VHS poutine copper mug. Fingerstache synth kale chips, pour-over selfies edison bulb yuccie kinfolk 3 wolf moon fanny pack.

Air plant jean shorts iPhone, pop-up hot chicken leggings freegan trust fund edison bulb vaporware. Succulents unicorn drinking vinegar bushwick migas stumptown try-hard 90's. Trust fund man braid polaroid mixtape roof party blue bottle. Twee kombucha squid cliche, meh photo booth crucifix prism sustainable humblebrag 3 wolf moon hammock marfa leggings pitchfork. Cred lo-fi offal leggings, umami swag vape. Ennui kogi keytar, four loko franzen fam you probably haven't heard of them fanny pack lyft fashion axe chicharrones gentrify knausgaard. Shabby chic freegan kinfolk authentic, echo park cardigan paleo cred organic green juice pop-up.

Health goth narwhal shaman, truffaut tbh street art VHS selvage irony crucifix man bun shoreditch mustache ethical godard. Blog activated charcoal banh mi viral, hammock VHS fashion axe twee echo park. Slow-carb gluten-free cornhole franzen leggings, gochujang occupy intelligentsia man bun. Palo santo twee bitters salvia semiotics, ugh mustache marfa migas literally cronut selvage mixtape pinterest prism.

Green juice wayfarers kitsch man bun vinyl farm-to-table vegan pop-up. Slow-carb vaporware quinoa, offal cronut listicle marfa waistcoat kogi austin woke iceland umami hexagon. Humblebrag kinfolk tote bag, hot chicken lyft asymmetrical knausgaard kogi activated charcoal. Listicle skateboard messenger bag butcher, master cleanse gochujang twee ugh. YOLO neutra semiotics biodiesel humblebrag air plant cred. Pug pinterest you probably haven't heard of them, shoreditch kogi swag synth. Lyft tumblr drinking vinegar echo park, palo santo occupy chartreuse vegan aesthetic.

Vaporware yr bespoke, street art scenester vape swag polaroid hoodie pok pok woke hammock. Offal 3 wolf moon neutra truffaut activated charcoal man braid selvage gastropub yr letterpress. Typewriter godard echo park 90's put a bird on it vaporware schlitz photo booth cold-pressed taiyaki. Heirloom helvetica tbh letterpress you probably haven't heard of them unicorn hammock pug green juice venmo authentic taxidermy lyft sustainable.

Craft beer salvia literally letterpress viral helvetica everyday carry. Mixtape man braid single-origin coffee pok pok paleo. Blue bottle scenester chambray bespoke farm-to-table. Messenger bag flannel craft beer, paleo kitsch kinfolk jianbing. Cloud bread pop-up ethical la croix crucifix, PBR&B hammock blue bottle cornhole shoreditch heirloom bushwick gochujang aesthetic drinking vinegar. Fixie chambray migas williamsburg subway tile put a bird on it yuccie. Cray sriracha gastropub sartorial, banh mi keytar lo-fi chia.

Lyft brooklyn beard, XOXO flexitarian selfies +1 before they sold out succulents hot chicken venmo hexagon crucifix gochujang. Shaman mlkshk lumbersexual fam lyft fingerstache thundercats raw denim seitan. Cold-pressed lumbersexual vape actually umami squid. Artisan man bun lo-fi, squid kombucha PBR&B ugh pok pok literally health goth irony direct trade messenger bag. Scenester sriracha cold-pressed photo booth hell of microdosing tilde glossier prism flannel vice poke 3 wolf moon.

Hammock pug snackwave, XOXO church-key vexillologist drinking vinegar kogi distillery pitchfork chillwave vaporware VHS. Tbh portland leggings mumblecore edison bulb artisan, truffaut blog humblebrag austin listicle. Hell of truffaut pork belly cronut copper mug hoodie, fixie taxidermy polaroid. Pinterest deep v farm-to-table gentrify ethical hashtag. Jianbing fanny pack ramps DIY, taiyaki wayfarers lomo tote bag keytar PBR&B bicycle rights migas gluten-free.

Humblebrag pok pok tacos hella hammock cold-pressed skateboard slow-carb. Fixie sriracha artisan godard plaid cred. Irony disrupt wolf gochujang organic kale chips helvetica asymmetrical unicorn humblebrag cred yuccie swag glossier slow-carb. Authentic celiac selfies next level. Mixtape migas portland whatever, polaroid vinyl yr pitchfork wayfarers tilde normcore meh lomo. Chartreuse flannel pok pok ugh palo santo raclette hell of. Pug wayfarers twee occupy authentic, williamsburg palo santo PBR&B ugh seitan cred try-hard roof party.

1234567890`;

	function handleNewAnnotation(event) {
		annotations.add({
			comment: null,
			user: 'jmakeig',
			range: event.detail.range
		});
	}
</script>

<style>
	main {
		display: flex;
		flex-direction: row;
	}
	header,
	section,
	footer {
		box-sizing: border-box;
		padding: 0.5em;
	}
	#Markdown {
		flex-grow: 1;

		padding: 1em;
		/* background: orange; */
	}
	#Annotations {
		width: 33%;
		flex-shrink: 0;
		padding: 0 1em;
		/* background: yellow; */
		border-left: solid 0.5px #ccc;
	}
	header {
		display: flex;
	}
	header > h1 {
		flex: 1;
	}
	section#User {
		width: 8em;
	}
	h1 {
		margin: 0;
	}
</style>

<header>
	<h1>Markdown Annotations</h1>
	<section id="User">
		<User name={$user.name} />
	</section>
</header>
<main>
	<section id="Markdown">
		<Highlighter
			on:selectionchange={event => console.log(event.detail)}
			on:newannotation={handleNewAnnotation}>
			<Markdown
				text={dummy}
				{annotations}
				on:selectannotation={event => {
					console.log(event.detail);
					annotations.select(event.detail);
				}} />
		</Highlighter>
	</section>
	<section id="Annotations">
		<Annotations items={annotations} />
	</section>
</main>
<footer>&copy;</footer>
