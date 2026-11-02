/* FoodForward SA - content data used for dynamic rendering.
   NOTE: figures and sample posts are illustrative placeholders for the assignment. */
window.FF = window.FF || {};

FF.services = [
    {
        id: 'warehouse-foodbanking',
        name: 'Warehouse Foodbanking',
        category: 'Food Security',
        summary: 'Quality surplus food is recovered from the consumer goods supply chain and distributed through the FoodForward SA network.',
        details: 'Surplus but safe, quality food that would otherwise go to waste is collected from manufacturers, retailers and farms, stored in our warehouses and distributed to registered beneficiary organisations such as soup kitchens, crèches and shelters.',
        audience: 'Registered beneficiary organisations and food donors',
        icon: 'warehouse'
    },
    {
        id: 'virtual-foodbanking',
        name: 'Virtual Foodbanking',
        category: 'Food Security',
        summary: 'Virtual Foodbanking connects available food with organisations that need food support.',
        details: 'Where food does not need to be stored in a warehouse, it is matched directly from the donor to a nearby organisation. This reduces transport, handling time and cost so that fresh food reaches people faster.',
        audience: 'Donors with available stock and organisations needing food',
        icon: 'link'
    },
    {
        id: 'mother-child-nutrition',
        name: 'Mother & Child Nutrition',
        category: 'Nutrition',
        summary: 'This programme focuses on supporting nutrition for mothers and children in vulnerable communities.',
        details: 'Targeted nutritional support helps mothers and young children in vulnerable communities receive healthy food during the most important stages of growth and development.',
        audience: 'Mothers, infants and young children',
        icon: 'child'
    },
    {
        id: 'food-gardens-connect',
        name: 'Food Gardens Connect',
        category: 'Community',
        summary: 'Food Gardens Connect supports community food gardens and helps communities improve access to food.',
        details: 'Community food gardens receive support, training and networking so that they can grow fresh vegetables to feed their families and neighbours, and build food independence over time.',
        audience: 'Community gardens, schools and households',
        icon: 'garden'
    },
    {
        id: 'volunteer-events',
        name: 'Volunteer and Events',
        category: 'Community',
        summary: "Volunteers can participate in events and activities that support FoodForward SA's work and help communities.",
        details: 'Volunteers help with sorting and packing food, community events and awareness drives. Individuals, school groups and company teams are welcome.',
        audience: 'Individuals, students and company teams',
        icon: 'hands'
    },
    {
        id: 'corporate-partnerships',
        name: 'Corporate Partnerships',
        category: 'Partnerships',
        summary: 'Businesses and organisations can partner with FoodForward SA to support food donations and increase their social impact.',
        details: 'Companies can donate surplus stock, sponsor food parcels or programmes, and involve staff in volunteering, while reducing waste and strengthening their social impact reporting.',
        audience: 'Businesses, retailers, manufacturers and foundations',
        icon: 'handshake'
    }
];

FF.updates = [
    { date: '2026-09-28', title: 'Surplus food recovery drive launched', body: 'Our food recovery teams are working with local retailers to rescue edible surplus food before it goes to waste.' },
    { date: '2026-09-15', title: 'Volunteer packing day', body: 'Volunteers are invited to join a sorting and packing day at the foodbank warehouse. Sign up through our contact page.' },
    { date: '2026-09-02', title: 'New community gardens joining the network', body: 'More community food gardens are being connected to training and support through Food Gardens Connect.' },
    { date: '2026-08-20', title: 'Nutrition support for mothers and children', body: 'Our Mother & Child Nutrition programme continues to reach vulnerable families in partner communities.' },
    { date: '2026-08-05', title: 'Corporate partners step up', body: 'Businesses across South Africa are donating surplus stock and sponsoring food parcels to increase their social impact.' },
    { date: '2026-07-18', title: 'Mandela Day service activities', body: 'Teams and schools gave their time to help pack and distribute food to organisations in need.' }
];

/* Illustrative enquiry pricing (Rand). Replace with the organisation\'s real figures. */
FF.pricing = {
    'sponsor-parcel':   { label: 'Sponsor food parcels',            unit: 250,  unitLabel: 'per parcel',   availability: 'Available all year round' },
    'donate-meals':     { label: 'Fund meals for beneficiaries',    unit: 5,    unitLabel: 'per meal',     availability: 'Available all year round' },
    'warehouse-collect':{ label: 'Surplus food collection (donor)', unit: 0,    unitLabel: 'no charge',    availability: 'Weekdays, subject to route scheduling' },
    'volunteer-group':  { label: 'Volunteer group session',         unit: 0,    unitLabel: 'no charge',    availability: 'Weekdays 08:00-15:00, Saturdays by arrangement' },
    'garden-support':   { label: 'Food garden starter support',     unit: 1200, unitLabel: 'per garden',   availability: 'Next intake: within 4-6 weeks' },
    'corporate-package':{ label: 'Corporate partnership package',   unit: 15000,unitLabel: 'per month',    availability: 'Limited places, a partnership manager will contact you' }
};
