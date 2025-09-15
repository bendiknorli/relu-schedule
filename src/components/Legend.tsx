import { Badge } from "./ui/badge";

export function Legend() {
    return (
        <div
            className="flex flex-wrap items-center gap-3 text-sm"
            aria-label="Legend"
        >
            <div className="flex items-center gap-2">
                <Badge variant="yellow">KICKOFF</Badge>
                <span>Kickoff / Work weekend</span>
            </div>
            <div className="flex items-center gap-2">
                <Badge variant="blue">BOOTCAMP</Badge>
                <span>Bootcamp / Education</span>
            </div>
            <div className="flex items-center gap-2">
                <Badge variant="green">TOWN HALL</Badge>
                <span>Town Hall</span>
            </div>
            <div className="flex items-center gap-2">
                <Badge variant="white">DEMO</Badge>
                <span>Demo</span>
            </div>
        </div>
    );
}
