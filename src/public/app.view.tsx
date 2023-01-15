import { h, JSXTemplate } from 'nest-jsx-template-engine';
import vis from 'vis';
export interface IAppProps {
    name: string;
    data: any
}


export function App(data: IAppProps, props: JSXTemplate.RenderProps): string {

    let [dt] = data.data;

    return <html>
        <body>
            <h1>Hello {JSON.stringify(data.data)}</h1>
        </body>


    </html>
}