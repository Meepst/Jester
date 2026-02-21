from pipeline.themes import THEMES

ESCALATION_SIGNALS = [
    "[ESCALATE]",
    "transfer me to a human",
    "connect me with an agent",
]

NEGATIVE_SIGNALS = [
    "this is unacceptable",
    "i want to speak to a manager",
    "you're useless",
]


def check_escalation(response: str) -> bool:
    response_lower = response.lower()

    theme_signals = [theme.escalation_phrase.lower() for theme in THEMES.values()]

    base_signals = [
        "[escalate]",
        "transfer me to a human",
        "connect me with an agent",
        "summon a senior member",
    ]

    return any(signal in response_lower for signal in theme_signals + base_signals)
