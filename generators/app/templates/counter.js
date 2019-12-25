import {Counter} from 'prom-client'

export const <%=counterName%>Counter = new Counter({
    name: '<%=counterSnake%>_counter',
    help: '<%=counterSentence%> counter',
    labelNames: [] //add the label types relevant for the counter
});