import { v4 as uuid4 } from 'uuid';

export const DEFAULT_TITLE = "~ Three Amigos Restaurante ~"
export const DEFAULT_MENU = [
    {
        id: uuid4(),
        title: "Appetizers",
        loc: "left",
        items: [
            {
                id: uuid4(),
                title: "Chorizo fries",
                desc: "French fries with melted cheese and chorizo",
                price: 9
            },
            {
                id: uuid4(),
                title: "Chicken Taquitos ",
                desc: "Spicy chicken with hot salsa and cotija cheese ",
                price: 11
            },
            {
                id: uuid4(),
                title: "Avocado salad ",
                desc: "Avocado, cherry tomatoe, pepper, onion, corn, black bean, dressing ",
                price: 8
            }
        ]
    },
    {
        id: uuid4(),
        title: "Mains",
        loc: "left",
        items: [
            {
                id: uuid4(),
                desc: "Choice of Chorizo, Steak, Ground beef, Grilled chicken, Slow-cooked Pork Shoulder, Shredded Cheese, Shredded lettuce, Diced Onions, Guacamole, Spicy Salsa, Sour cream ",
            },
            {
                id: uuid4(),
                title: "Tacos",
                desc: "Small hand-sized corn or wheat tortilla ",
                price: 9
            },
            {
                id: uuid4(),
                title: "Quesadillas ",
                desc: "Cheese tortilla cooked on a griddle ",
                price: 9
            },
            {
                id: uuid4(),
                title: "Nachos",
                desc: "Tortilla chips or totopos covered with melted chees",
                price: 9
            },
            {
                id: uuid4(),
                title: "Burritos",
                desc: "Flour tortilla wrapped into a sealed cylindrical shape ",
                price: 9
            },
            {
                id: uuid4(),
                title: "Tortas",
                desc: "Fluffy bun spread with butter ",
                price: 9
            },
            {
                id: uuid4(),
                title: "Sopes",
                desc: "Thick corn cakes ",
                price: 9
            },
        ]
    },
    {
        id: uuid4(),
        title: "Special",
        loc: "right",
        items: [
            {
                id: uuid4(),
                title: "El Gordito",
                desc: "Feast tasting menu for two, collection of all dishes on the menu",
                price: 34
            }
        ]
    },
    {
        id: uuid4(),
        title: "Deserts",
        loc: "right",
        items: [
            {
                id: uuid4(),
                title: "Sopaipillas",
                desc: "Spanish heritage - fried dough with honey",
                price: 6
            },
            {
                id: uuid4(),
                title: "Lemon Carlota",
                desc: "Layers of cookies and a creamy mix made out of canned milk and lime juice",
                price: 9
            },
            {
                id: uuid4(),
                title: "Horchata Ice Cream",
                desc: "Mexican rice milk flavored with cinnamon",
                price: 8
            },
        ]
    },
    {
        id: uuid4(),
        title: "Drinks",
        loc: "right",
        items: [
            {
                id: uuid4(),
                title: "Michelada",
                desc: "Mexican lager beer, lime juice, salsa juice, Worcestershire sauce, hot sauce",
                price: 8
            },
            {
                id: uuid4(),
                title: "Mexican Mule",
                desc: "Tequila, lime juice, ginger beer",
                price: 12
            },
            {
                id: uuid4(),
                title: "Margarita",
                desc: "Tequila, Cointreau, lime juice",
                price: 11
            },
        ]
    },
    {
        id: uuid4(),
        loc: "right",
        items: [
            {
                id: uuid4(),
                desc: "Allergy statement: Menu items may contain or come into contact with WHEAT, EGGS, PEANUTS, TREE, NUTS and MILK. For more information, please speak with a manager.",
            }
        ]
    },
]