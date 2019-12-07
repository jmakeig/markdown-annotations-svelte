import Markdown from './Markdown.svelte';

const md = `Sriracha beard kogi next level meh. Affogato ugh lumbersexual vinyl, tumblr cronut lomo selfies mustache retro chambray iceland lo-fi thundercats. Air plant brunch forage pour-over. Celiac raw denim literally meh yuccie. Before they sold out poutine pabst heirloom hoodie you probably haven't heard of them.

Semiotics fingerstache yr 8-bit, scenester kitsch narwhal messenger bag hexagon blue bottle migas bicycle rights authentic tofu. Kitsch ugh slow-carb master cleanse meggings lo-fi flannel man bun mumblecore locavore. Tumblr blog brunch wayfarers hashtag. Activated charcoal offal portland kitsch, tofu DIY lo-fi la croix post-ironic gochujang enamel pin next level taiyaki edison bulb chartreuse. Lyft meggings gluten-free chambray microdosing plaid irony thundercats fixie ethical. Normcore affogato locavore wayfarers af.

Food truck four loko four dollar toast raclette lyft, freegan beard. Deep v DIY subway tile gochujang. Thundercats distillery tilde drinking vinegar mustache glossier vice shoreditch iPhone bespoke blog biodiesel williamsburg mumblecore. Kinfolk pour-over literally fixie distillery.

Salvia stumptown small batch palo santo, iceland lyft occupy. Stumptown thundercats pabst, beard PBR&B gentrify fingerstache keffiyeh williamsburg. Snackwave ramps enamel pin biodiesel raclette la croix trust fund everyday carry swag. Next level thundercats +1 distillery unicorn fam before they sold out fashion axe single-origin coffee tumeric PBR&B copper mug green juice woke pok pok. Quinoa forage ethical poke taxidermy copper mug, iPhone bushwick fixie leggings fashion axe adaptogen shabby chic. Man bun chia seitan retro tumeric.

IPhone semiotics vegan cardigan irony cloud bread put a bird on it. Retro schlitz irony blue bottle cliche af letterpress street art occupy poutine truffaut. Taxidermy cardigan keytar, twee PBR&B single-origin coffee art party ugh la croix. Lomo art party farm-to-table raw denim flexitarian typewriter vape tilde keffiyeh food truck artisan readymade sriracha biodiesel.`;

// https://svelte.dev/docs#Creating_a_component
const app = new Markdown({
	target: document.body,
	props: {
		rawText: md
	}
});

export default app;
